"use client";
import React from "react";

interface IProps {
    title: string;
    isFormOpen?: boolean;
    onChange: (val: string) => void;
    onBlur?: () => void;
}

function SectionTitle({ title, isFormOpen, onChange, onBlur }: IProps) {
    return !isFormOpen ? (
        <h2 className="section-title">{title}</h2>
    ) : (
        <input
            type="text"
            placeholder={"Section Name"}
            defaultValue={title}
            className={"section-name-input"}
            onChange={(e) => onChange(e?.target?.value)}
            onBlur={() => onBlur && onBlur()}
        />
    );
}

export default SectionTitle;
