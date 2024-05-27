import { Formik } from "formik";
import { MultipleChoice } from "./components/multiple-choice/multiple-choice";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "./redux/store";
import { ChangeEvent } from "react";
import { multipleChoiceListActions, multipleChoiceListSelectors } from "./redux/features/multipleChoiceList/multipleChoiceListSlice";
import React from "react";
import { IMultipleChoiceListSubmission } from "./common/types";
import { extractChoicesFromMultipleChoiceList } from "./common/multiple-choice";
import Stack from "react-bootstrap/Stack";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";

import fingerprint_1 from "./images/fingerprint_1.png"
import { useTheme } from "styled-components";
import { useCurrentPlayer } from "./redux/features/player/playerSlice";

function Quiz() {
  const player = useCurrentPlayer()
  const multipleChoiceList = useAppSelector(state => multipleChoiceListSelectors.selectByName(state, "DRAFT"))

  const dispatch = useAppDispatch()

  const [questionIndex, setQuestionIndex] = React.useState(0)

  const answerRef = React.useRef<IMultipleChoiceListSubmission>({
    playerId: player?.id,
    startDate: new Date().toISOString(),
    finishDate: new Date().toISOString(),
    choices: []
  })

  React.useEffect(() => {
    if (multipleChoiceList) {
      return
    }
    dispatch(multipleChoiceListActions.fetchAll()).then(() => {
      answerRef.current.startDate = new Date().toISOString()
    })
  }, [dispatch, multipleChoiceList])

  const { uiBgColor } = useTheme()

  if (!multipleChoiceList || !player) {
    return (
      <Container fluid>
        <Image src={fingerprint_1} fluid />
      </Container>
    )
  }

  const previousQuestionVisible = questionIndex > 0
  const onClickPreviousQuestion = () => setQuestionIndex(questionIndex - 1)

  const nextQuestionDisable = questionIndex === multipleChoiceList.multipleChoice.length - 1
  const onClickNextQuestion = () => setQuestionIndex(questionIndex + 1)

  const choices = extractChoicesFromMultipleChoiceList(multipleChoiceList, player.id)

  const questionCounter = questionIndex + 1

  const buttonStyle = { border: "none", backgroundColor: uiBgColor }

  return (
    <Formik
      initialValues={{ choices }} onSubmit={() => { }}>
      {({ handleChange, values }) => (<Container fluid>
        <Image src={fingerprint_1} fluid />
        <MultipleChoice
          name={`choices[${questionIndex}]`}
          question={questionCounter + ". " + multipleChoiceList.multipleChoice[questionIndex].question}
          labels={multipleChoiceList.multipleChoice[questionIndex].labels}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const choices = [...values.choices]
            choices[questionIndex] = e.target.value
            const answer: IMultipleChoiceListSubmission = {
              ...answerRef.current,
              finishDate: new Date().toISOString(),
              choices: choices.map(el => el === null ? null : Number(el))
            }
            dispatch(multipleChoiceListActions.submitAnswer(
              multipleChoiceList.id,
              answer
            ))
            handleChange(e)
          }}
        />
        {/* {multipleChoiceList.multipleChoice.map((el, i) => (
          <MultipleChoice key={i}
            name={`choices[${i}]`}
            question={el.question}
            labels={el.labels}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const choices = [...values.choices]
              choices[i] = e.target.value
              const answer: IMultipleChoiceListSubmission = {
                ...answerRef.current,
                finishDate: new Date().toISOString(),
                choices: choices.map(el => el === null ? null : Number(el))
              }
              dispatch(multipleChoiceListActions.submitAnswer(
                multipleChoiceList.id,
                answer
              ))
              handleChange(e)
            }}
          />
        ))} */}
        <Row className="sticky-bottom">
          <Col>
            <Stack>
              {previousQuestionVisible && <Button onClick={onClickPreviousQuestion} style={buttonStyle}>Vraag {questionCounter - 1}</Button>}
            </Stack>
          </Col>
          <Col>
            <Stack>
              <Button disabled={nextQuestionDisable} onClick={onClickNextQuestion} style={buttonStyle}>Vraag {questionCounter + 1}</Button>
            </Stack>
          </Col>
        </Row>
      </Container >)
      }
    </Formik >
  );
}

export default Quiz;
