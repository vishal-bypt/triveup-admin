'use client'
import { useSelector } from "react-redux";

const Loader = () => {
    const loaderValue: boolean = useSelector((state: any) => state.loader.value);

    return (
        loaderValue && (
            <div
                className="overlay"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0, 0, 0, 0.2)", // semi-transparent background
                    zIndex: 1, // make sure it's on top
                }}
            >
                <div className="" style={{ position: "absolute", top: "50%", left: "50%", zIndex: 999 }}>
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>

        )
    );
}


export default Loader;