'use client'
import { useState } from "react";

export default function ColorPickerTags({ onChange, availableColors }) {
    const [writtenValue , setWrittenValue] = useState('');

    const addColor = (val) => {
        const v = val.trim();
        if (!v) return;
        // optional: normalize hex / validate
        if (!availableColors.includes(v)) {
            const next = [...availableColors, v];
            onChange(next);
            setWrittenValue('');
        }
    };

    const removeColor = (c) => {
        const next = availableColors.filter(x => x !== c);
        onChange(next);
    };

    return (
        <div>
            <div className="flex gap-2">
                <div className="w-full border  rounded-lg flex justify-between gap-5">
                    <input
                        type="text"
                        placeholder="Type color name or hex"
                        className="w-full outline-none py-3 px-4"
                        onChange={(e) => setWrittenValue(e.target.value)}
                    />

                    <button type="button" className="text-sm border-gray-500 bg-main cursor-pointer py-3 px-4  text-white rounded-r-sm"
                        onClick={() => {
                            addColor(writtenValue)
                        }}
                    >Add</button>
                </div>
                <input
                    type="color"
                    onChange={(e) => addColor(e.target.value)}
                    className="w-12 h-12 p-0 border rounded"
                />
            </div>

            {availableColors.length > 0 && <div className="flex gap-2 flex-wrap mt-2">
                {availableColors.map((c) => (
                    <button
                        key={c}
                        type="button"
                        className="flex items-center gap-2 px-2 py-1 rounded-full border"
                        onClick={() => removeColor(c)}
                    >
                        <span className="w-4 h-4 rounded-full" style={{ background: c }} />
                        <span className="text-sm">{c}</span>
                        <span className="ml-1 text-xs text-red-500">×</span>
                    </button>
                ))}
            </div>}
        </div>
    );
}
