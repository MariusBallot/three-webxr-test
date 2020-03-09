import ThreeScene from "../classes/ThreeScene"
import RAF from '../utils/raf'

class WebXRController {

    constructor() {
        this.bind()
        this.xrSession = null;
        this.xrViewerSpace = null;
        this.xrHitTestSource = null;
        this.xrRefSpace = null;

    }

    initXR() {
        if (!window.isSecureContext) {
            let message = "WebXR unavailable due to insecure context";
            console.log(message)
        }

        if (navigator.xr) {
            console.log(navigator.xr)
        }

    }

    onSessionStarted(session) {
        this.xrSession = session;
        this.gl = ThreeScene.renderer.getContext();
        ThreeScene.camera.matrixAutoUpdate = false;

        this.gl.xrCompatible = true

        session.updateRenderState({ baseLayer: new XRWebGLLayer(session, this.gl) });

        session.requestReferenceSpace('viewer').then((refSpace) => {
            this.xrViewerSpace = refSpace;
            session.requestHitTestSource({ space: this.xrViewerSpace }).then((hitTestSource) => {
                this.xrHitTestSource = hitTestSource;
            });
        });

        session.requestReferenceSpace('local').then((refSpace) => {
            this.xrRefSpace = refSpace;

            session.requestAnimationFrame(this.onXRFrame);
        });
    }

    onRequest() {
        if (!this.xrSession) {
            navigator.xr.requestSession('immersive-ar', { requiredFeatures: ['local', 'hit-test'] }).then(this.onSessionStarted);
            ThreeScene.init()
        } else {
            this.xrSession.end();
        }
    }

    onXRFrame(time, frame) {
        let session = frame.session;
        let pose = frame.getViewerPose(this.xrRefSpace);


        if (this.xrHitTestSource && pose) {
            let hitTestResults = frame.getHitTestResults(this.xrHitTestSource);
            if (hitTestResults.length > 0) {
                let pose = hitTestResults[0].getPose(xrRefSpace);
                reticle.visible = true;
                reticle.matrix = pose.transform.matrix;
            }
        }

        session.requestAnimationFrame(this.onXRFrame);

        // this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, session.baseLayer.framebuffer);

        // if (pose) {
        //     for (let view of frame.views) {
        //         const viewport = session.baseLayer.getViewport(view);
        //         ThreeScene.renderer.setSize(viewport.width, viewport.height);

        //         ThreeScene.camera.projectionMatrix.fromArray(view.projectionMatrix);
        //         const viewMatrix = new THREE.Matrix4().fromArray(pose.getViewMatrix(view));
        //         this.camera.matrix.getInverse(viewMatrix);
        //         this.camera.updateMatrixWorld(true);

        //         this.renderer.clearDepth();

        //         this.renderer.render(this.scene, this.camera);
        //     }
        // }
    }

    bind() {
        this.initXR = this.initXR.bind(this)
        this.onRequest = this.onRequest.bind(this)
        this.onSessionStarted = this.onSessionStarted.bind(this)
        this.onXRFrame = this.onXRFrame.bind(this)
    }
}


const _instance = new WebXRController()
export default _instance