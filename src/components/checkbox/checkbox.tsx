import React from "react";
import * as styled from "./checkbox.styled"

import { Field, FieldAttributes } from "formik"

type ICheckboxProps = {
    label: string
} & FieldAttributes<any>

export const Checkbox: React.FC<ICheckboxProps> = ({ label, ...fieldProps }) => {
    return (
        <styled.Label>
          <Field type="radio" {...fieldProps} />{label}
        </styled.Label>
    )
}