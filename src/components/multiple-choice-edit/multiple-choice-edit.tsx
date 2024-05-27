import React, { PropsWithChildren } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { Field, FieldArray, useField, useFormikContext } from "formik";
import Stack from "react-bootstrap/Stack";
import { IMultipleChoice } from "../../common/types";
import { MultipleChoice } from "../multiple-choice/multiple-choice";

interface IMultipleChoiceEditProps {
    name: string
}

export const MultipleChoiceEdit: React.FC<PropsWithChildren<IMultipleChoiceEditProps>> = ({ name, children }) => {
    const [{ }, metaProps] = useField<IMultipleChoice & { correct: string, checked: string }>(name)
    const { setFieldValue } = useFormikContext()

    const values = metaProps.value

    React.useEffect(() => {
        if (values.checked === values.correct) {
            return
        }
        setFieldValue(`${name}.checked`, values.correct)
    }, [values, values.correct, name, setFieldValue])

    const correctFieldName = `${name}.correct`

    return (<>
        <tr>
            <td>Vraag</td>
            <td colSpan={2}>
                <Field as={Form.Control} name={`${name}.question`} type="text" />
            </td>
            <td rowSpan={values.labels.length + 4} width="8%*">{children}</td>
        </tr>
        <tr>
            <td rowSpan={values.labels.length + 2}>Opties</td>
            <td>Label</td>
            <td>Goed</td>
        </tr>
        <FieldArray name={`${name}.labels`}>
            {({ push, move, remove }) => (<>
                {values.labels.map((el, i) => (<tr key={i}>
                    <td>
                        <Stack direction="horizontal" gap={1}>
                            <Field as={Form.Control} type="text" name={`${name}.labels[${i}]`} />
                            <Stack direction="horizontal">
                                <Button disabled={i === 0} onClick={() => {
                                    if (values.correct === i.toString()) {
                                        setFieldValue(correctFieldName, (i - 1).toString())
                                    }
                                    else if (values.correct === (i - 1).toString()) {
                                        setFieldValue(correctFieldName, i.toString())
                                    }
                                    move(i, i - 1)
                                }}>-</Button>
                                <Button disabled={i === values.labels.length - 1} onClick={() => {
                                    if (values.correct === i.toString()) {
                                        setFieldValue(correctFieldName, (i + 1).toString())
                                    }
                                    else if (values.correct === (i + 1).toString()) {
                                        setFieldValue(correctFieldName, i.toString())
                                    }
                                    move(i, i + 1)
                                }}>+</Button>
                                <Button variant="danger" onClick={() => {
                                    if (values.correct === i.toString()) {
                                        setFieldValue(correctFieldName, "")
                                    }
                                    else if (values.correct && values.labels.length > 1) {
                                        setFieldValue(correctFieldName, (+values.correct - 1).toString())
                                    }
                                    remove(i)
                                }}>X</Button>
                            </Stack>
                        </Stack>
                    </td>
                    <td>
                        <Field as={Form.Check} type="radio" name={correctFieldName} value={i.toString()} />
                    </td>
                </tr>))}
                <tr>
                    <td colSpan={3}>
                        <Button variant="success" onClick={() => push("")}>+</Button>
                    </td>
                </tr>
            </>)}
        </FieldArray>
        <tr>
            <td colSpan={3}>
                <div style={{ color: "white", backgroundColor: "black" }}>
                    <MultipleChoice disabled name={`${name}.checked`} question={values.question} labels={values.labels} />
                </div>
            </td>
        </tr>
    </>)

    // return (<Stack>
    //     <Table striped bordered>
    //         <tbody>
    //             <tr>
    //                 <td>Vraag</td>
    //                 <td colSpan={2}>
    //                     <Field as={Form.Control} name={`${name}.question`} type="text" />
    //                 </td>
    //             </tr>
    //             <tr>
    //                 <td rowSpan={values.labels.length + 2}>Opties</td>
    //                 <td>Label</td>
    //                 <td>Goed</td>
    //             </tr>
    //             <FieldArray name={`${name}.labels`}>
    //                 {({ push, move, remove }) => (
    //                     <>
    //                         {values.labels.map((el, i) => (
    //                             <tr key={i}>
    //                                 <td>
    //                                     <Stack direction="horizontal" gap={1}>
    //                                         <Field as={Form.Control} type="text" name={`${name}.labels[${i}]`} />
    //                                         <Button disabled={i === 0} onClick={() => {
    //                                             if (values.correct === i.toString()) {
    //                                                 setFieldValue(correctFieldName, (i - 1).toString())
    //                                             }
    //                                             else if (values.correct === (i - 1).toString()) {
    //                                                 setFieldValue(correctFieldName, i.toString())
    //                                             }
    //                                             move(i, i - 1)
    //                                         }}>-</Button>
    //                                         <Button disabled={i === values.labels.length - 1} onClick={() => {
    //                                             if (values.correct === i.toString()) {
    //                                                 setFieldValue(correctFieldName, (i + 1).toString())
    //                                             }
    //                                             else if (values.correct === (i + 1).toString()) {
    //                                                 setFieldValue(correctFieldName, i.toString())
    //                                             }
    //                                             move(i, i + 1)
    //                                         }}>+</Button>
    //                                         <Button variant="danger" onClick={() => {
    //                                             if (values.correct === i.toString()) {
    //                                                 setFieldValue(correctFieldName, "")
    //                                             }
    //                                             else if (values.correct && values.labels.length > 1) {
    //                                                 setFieldValue(correctFieldName, (+values.correct - 1).toString())
    //                                             }
    //                                             remove(i)
    //                                         }}>X</Button>
    //                                     </Stack>

    //                                 </td>
    //                                 <td>
    //                                     <Field as={Form.Check} type="radio" name={correctFieldName} value={i.toString()} />
    //                                 </td>
    //                             </tr>
    //                         ))}
    //                         <tr>
    //                             <td colSpan={2}><Button variant="success" onClick={() => push("")}>+</Button></td>
    //                         </tr>
    //                     </>
    //                 )}
    //             </FieldArray>
    //         </tbody>
    //     </Table >
    //     <div style={{ color: "white", backgroundColor: "black" }}>
    //         <MultipleChoice disabled name={`${name}.checked`} question={values.question} labels={values.labels} />
    //     </div>
    // </Stack>)
}