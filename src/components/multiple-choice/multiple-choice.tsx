import React from "react"
import { Checkbox } from "../checkbox/checkbox"
import { FieldAttributes } from "formik"

type IMultipleChoiceProps = {
    question: string
    labels: string[]
} & FieldAttributes<Object>

export const MultipleChoice: React.FC<IMultipleChoiceProps> = ({ question, labels, ...fieldProps }) => {
    return (
        <>
            <p style={{fontSize:"2em"}}>{question}</p>
            {
                labels.map((label, i) => (<Checkbox key={i} {...fieldProps} value={i.toString()} label={label} />))
            }
        </>
    )
}