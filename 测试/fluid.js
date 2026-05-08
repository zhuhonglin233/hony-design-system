const canvas = document.getElementById('fluid-canvas');
const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
const hint = document.querySelector('.hint');

const config = {
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 1024,
    CAPTURE_RESOLUTION: 512,
    DENSITY_DISSIPATION: 3.5,
    VELOCITY_DISSIPATION: 2,
    PRESSURE: 0.1,
    PRESSURE_ITERATIONS: 20,
    CURL: 3,
    SPLAT_RADIUS: 0.2,
    SPLAT_FORCE: 6000,
    COLOR_UPDATE_SPEED: 10,
    RAINBOW_MODE: true,
    COLOR: { r: 59 / 255, g: 130 / 255, b: 246 / 255 },
    BACK_COLOR: { r: 0.05, g: 0.05, b: 0.05 }
};

let simWidth, simHeight, dyeWidth, dyeHeight;
let velocity, density, pressure, divergence;
let blit, ext;
let pointers = [];
let lastTime = Date.now();

function getResolution(resolution) {
    let aspectRatio = gl.canvas.width / gl.canvas.height;
    if (aspectRatio < 1) aspectRatio = 1 / aspectRatio;
    const min = Math.round(resolution);
    const max = Math.round(resolution * aspectRatio);
    return gl.canvas.width > gl.canvas.height
        ? { width: max, height: min }
        : { width: min, height: max };
}

function initFramebuffers() {
    const simRes = getResolution(config.SIM_RESOLUTION);
    const dyeRes = getResolution(config.DYE_RESOLUTION);

    simWidth = simRes.width;
    simHeight = simRes.height;
    dyeWidth = dyeRes.width;
    dyeHeight = dyeRes.height;

    const texType = gl.FLOAT;
    const rgba = { internalFormat: gl.RGBA, format: gl.RGBA };

    velocity = createDoubleFBO(simWidth, simHeight, texType, rgba);
    density = createDoubleFBO(dyeWidth, dyeHeight, texType, rgba);
    pressure = createDoubleFBO(simWidth, simHeight, texType, rgba);
    divergence = createFBO(simWidth, simHeight, texType, rgba);
}

function createFBO(w, h, texType, rgba) {
    gl.activeTexture(gl.TEXTURE0);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, rgba.internalFormat, w, h, 0, rgba.format, texType, null);

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    return { texture, fbo, width: w, height: h };
}

function createDoubleFBO(w, h, texType, rgba) {
    let fbo1 = createFBO(w, h, texType, rgba);
    let fbo2 = createFBO(w, h, texType, rgba);

    return {
        width: w,
        height: h,
        texelSizeX: 1 / w,
        texelSizeY: 1 / h,
        get read() { return fbo1; },
        set read(value) { fbo1 = value; },
        get write() { return fbo2; },
        set write(value) { fbo2 = value; },
        swap() { [fbo1, fbo2] = [fbo2, fbo1]; }
    };
}

function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
    }
    return shader;
}

function getVertexShader() {
    return `
        precision highp float;
        attribute vec2 aPosition;
        varying vec2 vUv;
        varying vec2 vL;
        varying vec2 vR;
        varying vec2 vT;
        varying vec2 vB;
        uniform vec2 texelSize;

        void main () {
            vUv = aPosition * 0.5 + 0.5;
            vL = vUv - vec2(texelSize.x, 0.0);
            vR = vUv + vec2(texelSize.x, 0.0);
            vT = vUv + vec2(0.0, texelSize.y);
            vB = vUv - vec2(0.0, texelSize.y);
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
    `;
}

function getCopyShader() {
    return `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;

        void main () {
            gl_FragColor = texture2D(uTexture, vUv);
        }
    `;
}

function getClearShader() {
    return `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uTexture;
        uniform float value;

        void main () {
            gl_FragColor = value * texture2D(uTexture, vUv);
        }
    `;
}

function getDisplayShader() {
    return `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uTexture;

        void main () {
            vec3 c = texture2D(uTexture, vUv).rgb;
            float a = max(c.r, max(c.g, c.b));
            gl_FragColor = vec4(c, a);
        }
    `;
}

function getSplatterShader() {
    return `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uTarget;
        uniform float aspectRatio;
        uniform vec3 color;
        uniform vec2 point;
        uniform float radius;

        void main () {
            vec2 p = vUv - point;
            p.x *= aspectRatio;
            vec3 splatter = vec3(1.0 - length(p / radius));
            splatter = clamp(splatter, 0.0, 1.0);
            vec3 base = texture2D(uTarget, vUv).xyz;
            vec3 col = mix(base, color, splatter * 0.5);
            gl_FragColor = vec4(col, 1.0);
        }
    `;
}

function getCurlShader() {
    return `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vUv - vec2(texelSize.x, 0.0)).y;
            float R = texture2D(uVelocity, vUv + vec2(texelSize.x, 0.0)).y;
            float T = texture2D(uVelocity, vUv + vec2(0.0, texelSize.y)).x;
            float B = texture2D(uVelocity, vUv - vec2(0.0, texelSize.y)).x;
            float vorticity = R - L - T + B;
            gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
        }
    `;
}

function getVorticityShader() {
    return `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uCurl;
        uniform float curl;
        uniform float dt;

        void main () {
            float L = texture2D(uCurl, vUv - vec2(texelSize.x, 0.0)).x;
            float R = texture2D(uCurl, vUv + vec2(texelSize.x, 0.0)).x;
            float T = texture2D(uCurl, vUv + vec2(0.0, texelSize.y)).x;
            float B = texture2D(uCurl, vUv - vec2(0.0, texelSize.y)).x;
            float C = texture2D(uCurl, vUv).x;

            vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
            force /= length(force) + 0.0001;
            force *= curl * C;
            force.y *= -1.0;

            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity += force * dt;
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
    `;
}

function getDivergenceShader() {
    return `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uVelocity, vUv - vec2(texelSize.x, 0.0)).x;
            float R = texture2D(uVelocity, vUv + vec2(texelSize.x, 0.0)).x;
            float T = texture2D(uVelocity, vUv + vec2(0.0, texelSize.y)).y;
            float B = texture2D(uVelocity, vUv - vec2(0.0, texelSize.y)).y;

            float div = 0.5 * (R - L + T - B);
            gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
        }
    `;
}

function getPressureShader() {
    return `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uPressure;
        uniform sampler2D uDivergence;

        void main () {
            float L = texture2D(uPressure, vUv - vec2(texelSize.x, 0.0)).x;
            float R = texture2D(uPressure, vUv + vec2(texelSize.x, 0.0)).x;
            float T = texture2D(uPressure, vUv + vec2(0.0, texelSize.y)).x;
            float B = texture2D(uPressure, vUv - vec2(0.0, texelSize.y)).x;
            float C = texture2D(uPressure, vUv).x;
            float D = texture2D(uDivergence, vUv).x;

            float pressure = (L + R + B + T - D) * 0.25;
            gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
        }
    `;
}

function getGradientSubtractShader() {
    return `
        precision mediump float;
        precision mediump sampler2D;
        varying highp vec2 vUv;
        uniform sampler2D uPressure;
        uniform sampler2D uVelocity;

        void main () {
            float L = texture2D(uPressure, vUv - vec2(texelSize.x, 0.0)).x;
            float R = texture2D(uPressure, vUv + vec2(texelSize.x, 0.0)).x;
            float T = texture2D(uPressure, vUv + vec2(0.0, texelSize.y)).x;
            float B = texture2D(uPressure, vUv - vec2(0.0, texelSize.y)).x;

            vec2 velocity = texture2D(uVelocity, vUv).xy;
            velocity.xy -= vec2(R - L, T - B);
            gl_FragColor = vec4(velocity, 0.0, 1.0);
        }
    `;
}

function getAdvectionShader() {
    return `
        precision highp float;
        precision highp sampler2D;
        varying vec2 vUv;
        uniform sampler2D uVelocity;
        uniform sampler2D uSource;
        uniform vec2 texelSize;
        uniform float dt;
        uniform float dissipation;

        void main () {
            vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
            gl_FragColor = dissipation * texture2D(uSource, coord);
        }
    `;
}

let copyProgram, clearProgram, displayProgram, splatProgram, curlProgram;
let vorticityProgram, divergenceProgram, pressureProgram, gradientSubtractProgram, advectionProgram;

function initBlit() {
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
}

function initPrograms() {
    copyProgram = createProgram(getVertexShader(), getCopyShader());
    clearProgram = createProgram(getVertexShader(), getClearShader());
    displayProgram = createProgram(getVertexShader(), getDisplayShader());
    splatProgram = createProgram(getVertexShader(), getSplatterShader());
    curlProgram = createProgram(getVertexShader(), getCurlShader());
    vorticityProgram = createProgram(getVertexShader(), getVorticityShader());
    divergenceProgram = createProgram(getVertexShader(), getDivergenceShader());
    pressureProgram = createProgram(getVertexShader(), getPressureShader());
    gradientSubtractProgram = createProgram(getVertexShader(), getGradientSubtractShader());
    advectionProgram = createProgram(getVertexShader(), getAdvectionShader());
}

function createProgram(vertexSource, fragmentSource) {
    const program = gl.createProgram();
    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.bindAttribLocation(program, 0, 'aPosition');
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
    }

    const uniforms = {};
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
        const uniformName = gl.getActiveUniform(program, i).name;
        uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
    }

    return { program, uniforms };
}

function blit(target) {
    if (target == null) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    } else {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    }
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

function resizeCanvas() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        initFramebuffers();
    }
}

function splat(x, y, dx, dy, color) {
    gl.useProgram(splatProgram.program);
    gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.texture.bindTexture());
    gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
    gl.uniform2f(splatProgram.uniforms.point, x, y);
    gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0);
    gl.uniform1f(splatProgram.uniforms.radius, config.SPLAT_RADIUS / 100);
    blit(velocity.write);
    velocity.swap();

    gl.uniform1i(splatProgram.uniforms.uTarget, density.read.texture.bindTexture());
    gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
    blit(density.write);
    density.swap();
}

function updateColors() {
    if (config.RAINBOW_MODE) {
        const time = Date.now() / 1000;
        const hue = (time * 50) % 360;
        config.COLOR = hslToRgb(hue / 360, 0.8, 0.6);
    }
}

function hslToRgb(h, s, l) {
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return { r, g, b };
}

function step(dt) {
    gl.disable(gl.BLEND);

    gl.useProgram(curlProgram.program);
    gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.texture.bindTexture());
    blit(curlProgram);

    gl.useProgram(vorticityProgram.program);
    gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.texture.bindTexture());
    gl.uniform1i(vorticityProgram.uniforms.uCurl, curlProgram);
    gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
    gl.uniform1f(vorticityProgram.uniforms.dt, dt);
    blit(velocity.write);
    velocity.swap();

    gl.useProgram(divergenceProgram.program);
    gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.texture.bindTexture());
    blit(divergence);

    gl.useProgram(clearProgram.program);
    gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.texture.bindTexture());
    gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
    blit(pressure.write);
    pressure.swap();

    gl.useProgram(pressureProgram.program);
    gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.texture.bindTexture());
    for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.texture.bindTexture());
        blit(pressure.write);
        pressure.swap();
    }

    gl.useProgram(gradientSubtractProgram.program);
    gl.uniform2f(gradientSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.texture.bindTexture());
    gl.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.texture.bindTexture());
    blit(velocity.write);
    velocity.swap();

    gl.useProgram(advectionProgram.program);
    gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.texture.bindTexture());
    gl.uniform1i(advectionProgram.uniforms.uSource, velocity.read.texture.bindTexture());
    gl.uniform1f(advectionProgram.uniforms.dt, dt);
    gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
    blit(velocity.write);
    velocity.swap();

    gl.uniform2f(advectionProgram.uniforms.texelSize, dyeWidth > 0 ? 1 / dyeWidth : 0, dyeHeight > 0 ? 1 / dyeHeight : 0);
    gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.texture.bindTexture());
    gl.uniform1i(advectionProgram.uniforms.uSource, density.read.texture.bindTexture());
    gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
    blit(density.write);
    density.swap();
}

function render() {
    gl.useProgram(displayProgram.program);
    gl.uniform1i(displayProgram.uniforms.uTexture, density.read.texture.bindTexture());
    blit(null);
}

function update() {
    resizeCanvas();
    updateColors();

    const now = Date.now();
    let dt = (now - lastTime) / 1000;
    dt = Math.min(dt, 0.016);
    lastTime = now;

    pointers.forEach(p => {
        if (p.moved) {
            const color = config.COLOR;
            splat(p.x, p.y, p.dx * config.SPLAT_FORCE, p.dy * config.SPLAT_FORCE, color);
            p.moved = false;
        }
    });

    step(dt);
    render();
    requestAnimationFrame(update);
}

function onPointerMove(e) {
    hint.classList.add('hidden');
    const x = e.clientX / canvas.width;
    const y = 1 - e.clientY / canvas.height;

    pointers.forEach(p => {
        if (p.id === -1) {
            const dx = x - p.x;
            const dy = y - p.y;
            p.moved = true;
            p.dx = dx * 10;
            p.dy = dy * 10;
            p.x = x;
            p.y = y;
        }
    });
}

function onPointerDown(e) {
    pointers.push({
        id: -1,
        x: e.clientX / canvas.width,
        y: 1 - e.clientY / canvas.height,
        dx: 0,
        dy: 0,
        moved: false
    });
}

function onPointerUp() {
    pointers = pointers.filter(p => p.id !== -1);
}

function init() {
    gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) {
        console.error('WebGL not supported');
        return;
    }

    canvas.addEventListener('mousemove', onPointerMove);
    canvas.addEventListener('mousedown', onPointerDown);
    canvas.addEventListener('mouseup', onPointerUp);
    canvas.addEventListener('touchmove', e => {
        e.preventDefault();
        onPointerMove(e.touches[0]);
    });
    canvas.addEventListener('touchstart', e => {
        onPointerDown(e.touches[0]);
    });
    canvas.addEventListener('touchend', onPointerUp);

    initBlit();
    initPrograms();
    initFramebuffers();

    update();
}

init();