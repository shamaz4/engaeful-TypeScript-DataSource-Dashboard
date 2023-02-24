/*
    The sole purpose of this file is to fit all nodes into the view.
*/
import React, { useState, useEffect, useRef } from "react";
import ReactFlow, { useZoomPanHelper } from "react-flow-renderer";

const AutoZoom = ({ nodesLoaded = false, count = 0 }) => {
    const [loaded, setLoaded] = useState(nodesLoaded);
    const [viewFitted, setViewFitted] = useState(false);
    const { fitView, zoomOut, project } = useZoomPanHelper();

    useEffect(() => {
        setLoaded(nodesLoaded);
    }, [nodesLoaded]);

    useEffect(() => {
        if (loaded && !viewFitted) {
            fitView();
            setViewFitted(true);
            if (count > 0) {
                project(-2000);
                zoomOut();
                zoomOut();
            }
        }
    });
    return "";
};

export default AutoZoom;
