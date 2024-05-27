import React from "react";

import { Field, FieldArray, Formik } from "formik";
import { MultipleChoiceEdit } from "../multiple-choice-edit/multiple-choice-edit";
import { createMultipleChoice, createMultipleChoiceList } from "../../common/multiple-choice";

import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { useAppDispatch, useAppSelector } from "../../redux/store";
import { IMultipleChoiceList } from "../../common/types";
import { multipleChoiceListActions, multipleChoiceListSelectors } from "../../redux/features/multipleChoiceList/multipleChoiceListSlice";

export const MultipleChoiceListEdit: React.FC = () => {
    const multipleChoiceList = useAppSelector(state => multipleChoiceListSelectors.selectByName(state, "DRAFT"))

    const dispatch = useAppDispatch()

    React.useEffect(() => {
        if (multipleChoiceList) {
            return
        }
        dispatch(multipleChoiceListActions.fetchAll())
    }, [dispatch, multipleChoiceList])

    const initialValues: IMultipleChoiceList<{ correct?: string, checked?: string }> = {
        ...(multipleChoiceList ?? createMultipleChoiceList())
    }
    initialValues.multipleChoice = [...initialValues.multipleChoice]

    if (!initialValues.multipleChoice.length) {
        initialValues.multipleChoice.push(createMultipleChoice("", [], 0))
    }

    return (<Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={(value: IMultipleChoiceList) => {
            dispatch(multipleChoiceListActions.upsertOne(value))
        }}>{({ values, submitForm }) => (<Table>
            <tbody>
                <tr>
                    <td>Naam</td>
                    <td colSpan={2}>
                        <Field as={Form.Control} name="name" type="text" />
                    </td>
                </tr>
                <tr>
                    <td colSpan={3}>Vragen</td>
                </tr>
                <FieldArray name="multipleChoice">
                    {({ move, push, remove }) => (<>{
                        values.multipleChoice.map((el, i) => (
                            <MultipleChoiceEdit key={i} name={`multipleChoice[${i}]`}>
                                <Button disabled={i === 0} onClick={() => move(i, i - 1)}>-</Button>
                                <Button disabled={i === values.multipleChoice.length - 1} onClick={() => move(i, i + 1)}>+</Button>
                                <Button variant="danger" onClick={() => remove(i)}>X</Button>
                            </MultipleChoiceEdit>
                        ))}
                        <tr>
                            <td>

                                <Button variant="success" onClick={() => push(createMultipleChoice("", [], 0))}>+</Button>
                                <Button onClick={submitForm}>Submit</Button>
                            </td>
                        </tr>
                    </>)}
                </FieldArray>
            </tbody>
        </Table>)
        }
    </Formik >)
}