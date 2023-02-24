/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/no-this-in-sfc */
/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-this-alias */
import React, { useState, useEffect, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import BlotFormatter from "quill-blot-formatter";
import "react-quill/dist/quill.snow.css";
import "./QuillEditor.css";

// Quill.register("modules/blotFormatter", BlotFormatter);

function QuillEditor({ value, onChange }) {
    const psRef = useRef();
    const quillRef = useRef();
    const [currentValue, setValue] = useState(value);
    const [isFocused, setIsFocused] = useState(false);

    /** Debounce function */
    function debounce(func, wait, immediate) {
        let timeout;
        return function () {
            const context = this;
            const args = arguments;
            const later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    const handleChange = debounce((content, delta, source, editor) => {
        // console.log(JSON.stringify(editor.getContents().ops));
        onChange(editor.getContents().ops);
        // setValue(JSON.stringify(editor.getContents().ops));
    }, 10);

    function imageHandler() {
        const range = this.quill.getSelection();
        const value = prompt("please copy paste the image url here.");
        if (value) {
            this.quill.insertEmbed(
                range.index,
                "image",
                value,
                Quill.sources.USER
            );
        }
    }

    const modules = {
        blotFormatter: {
            init: () => {
            },
        },
        history: {
            delay: 2000,
            maxStack: 500,
            userOnly: true
          }
        // toolbar: {
        //     container: [
        //         [{ header: [1, 2, false] }],
        //         [
        //             { align: "" },
        //             { align: "center" },
        //             { align: "right" },
        //             { align: "justify" },
        //         ],
        //         ["bold", "italic", "underline", "strike"],
        //         [{ list: "ordered" }, { list: "bullet" }],
        //         ["link", "image"],
        //     ],
        //     handlers: {
        //         image: imageHandler,
        //     },
        // },
    };

    const formats = [
        "header",
        "align",
        "imageBlot",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
    ];

    const handleClick = (e) => {
        if (psRef.current) {
            if (psRef.current.contains(e.target)) {
                setTimeout(() => {
                    document.querySelector(".ql-toolbar").style.display =
                        "inline-block";
                }, 5);
            } else {
                document.querySelector(".ql-toolbar").style.display = "none";
            }
        } else {
            document.querySelector(".ql-toolbar").style.display = "none";
        }
    };

    useEffect(() => {
        // add when mounted
        document.addEventListener("mousedown", handleClick);
        // return function to be called when unmounted
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    return (
        <>
            <div ref={psRef} className="text-editor">
                <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    // modules={{ ...modules }}
                    defaultValue={currentValue}
                    formats={formats}
                    onFocus={() => {
                    }}
                    onBlur={() => {
                    }}
                    onChange={handleChange}
                >
                    <div className="editingArea" />
                </ReactQuill>
            </div>
        </>
    );
}

export default QuillEditor;
