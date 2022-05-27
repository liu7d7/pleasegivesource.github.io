import React, {useContext, useState} from 'react';
import './App.css';

enum Screen {
    main, question, winner
}

const questions = new Set<string>()

class QuestionData {
    score: number
    question: string
    answer: string

    static readonly empty = new QuestionData(0, "", "")

    constructor(score: number, question: string, answer: string) {
        this.score = score
        this.question = question
        this.answer = answer
        questions.add(question)
    }
}

type GlobalState_t = {
    screen: Screen,
    setScreen: (_: Screen) => void,
    questionData: QuestionData,
    setQuestionData: (_: QuestionData) => void,
    finishedQuestions: Set<string>,
    setFinishedQuestions: (_: Set<string>) => void,
    showingAnswer: boolean,
    setShowingAnswer: (_: boolean) => void,
    team1Score: number,
    setTeam1Score: (_: number) => void,
    team2Score: number,
    setTeam2Score: (_: number) => void,
    currentPlayTeam: number,
    setCurrentPlayTeam: (_: number) => void
}

const GlobalState = {
    screen: Screen.main,
    setScreen: (_: Screen) => {},
    questionData: QuestionData.empty,
    setQuestionData: (_: QuestionData) => {},
    finishedQuestions: new Set<string>(),
    setFinishedQuestions: (_: Set<string>) => {},
    showingAnswer: false,
    setShowingAnswer: (_: boolean) => {},
    team1Score: 0,
    setTeam1Score: (_: number) => {},
    team2Score: 0,
    setTeam2Score: (_: number) => {},
    currentPlayTeam: 0,
    setCurrentPlayTeam: (_: number) => {}
} as GlobalState_t

const ctx = React.createContext(GlobalState)

export const App = () => {

    const [screen, setScreen] = useState(Screen.main)
    const [questionData, setQuestionData] = useState(QuestionData.empty)
    const [showingAnswer, setShowingAnswer] = useState(false)
    const [team1Score, setTeam1Score] = useState(0)
    const [team2Score, setTeam2Score] = useState(0)
    const [currentPlayTeam, setCurrentPlayTeam] = useState(1)
    const [finishedQuestions, setFinishedQuestions] = useState(new Set<string>())

    window.onkeydown = (ev) => {
        switch (ev.key) {
            case "Escape":
                if (screen === Screen.winner) {
                    setFinishedQuestions(new Set<string>())
                    setTeam2Score(0)
                    setTeam1Score(0)
                    setCurrentPlayTeam(1)
                }
                setScreen(Screen.main)
                setQuestionData(QuestionData.empty)
                break
            case "Enter":
                if (screen === Screen.question && questionData !== QuestionData.empty) {
                    setShowingAnswer(!showingAnswer)
                }
                break
        }
    }

    return (
        <div className="ml-10 mt-10 mr-10 mb-10 font-mono">
            <div className="text-center text-4xl mb-10">
                Je n'ai aucune idée de ce que je fais.
            </div>
            <ctx.Provider value={{ screen, setScreen, questionData, setQuestionData, finishedQuestions, setFinishedQuestions, showingAnswer, setShowingAnswer, team1Score, setTeam1Score, team2Score, setTeam2Score, currentPlayTeam, setCurrentPlayTeam }}>
                <Field/>
                <QuestionScreen/>
                <Team1/>
                <Team2/>
                <Winner/>
            </ctx.Provider>
        </div>
    );
}

const Winner = () => {

    const global = useContext(ctx)

    if (global.screen !== Screen.winner) {
        return null
    }

    return (
        <div className="full-screen-centered text-5xl">
            The winner is {global.team1Score > global.team2Score ? "Team 1" : "Team 2"}!
        </div>
    )
}

const Team1 = () => {

    const global = useContext(ctx)

    if (global.currentPlayTeam)
        return (
            <div className="bottom-center fill-amber-300 w-20 h-10 font-light text-gray-500 text-xl">
                <div className="text-center">Team 1</div>
                <div className="text-center">{global.team1Score}</div>
            </div>
        )
    return (
        <div className="bottom-center fill-amber-300 w-20 h-10 font-bold text-xl">
            <div className="text-center">Team 1</div>
            <div className="text-center">{global.team1Score}</div>
        </div>
    )
}

const Team2 = () => {

    const global = useContext(ctx)

    if (!global.currentPlayTeam)
        return (
            <div className="bottom-center1 fill-amber-300 w-20 h-10 font-light text-gray-500 text-xl">
                <div className="text-center">Team 2</div>
                <div className="text-center">{global.team2Score}</div>
            </div>
        )
    return (
        <div className="bottom-center1 fill-amber-300 w-20 h-10 font-bold text-xl">
            <div className="text-center">Team 2</div>
            <div className="text-center">{global.team2Score}</div>
        </div>
    )
}

const Field = () => {

    const global = useContext(ctx)

    if (global.screen !== Screen.main) {
        return null
    }

    return (
        <div className="grid grid-cols-5 gap-x-7 gap-y-7 content-start items-start">
            <Question question="hi" score={100} answer="ford"></Question>
            <Question question="hadfi" score={100} answer="ford"></Question>
            <Question question="hadsfi" score={100} answer="ford"></Question>
            <Question question="hxci" score={100} answer="ford"></Question>
            <Question question="sdfhi" score={100} answer="ford"></Question>
            <Question question="hixcv" score={200} answer="ford"></Question>
            <Question question="hi" score={200} answer="ford"></Question>
            <Question question="hi" score={200} answer="ford"></Question>
            <Question question="hci" score={200} answer="ford"></Question>
        </div>
    )
}

function resetAfterPlay(global: GlobalState_t) {
    global.setCurrentPlayTeam(global.currentPlayTeam ? 0 : 1)
    global.setShowingAnswer(false)
    const newSet = new Set<string>()
    global.finishedQuestions.forEach((it) => {
        newSet.add(it)
    })
    newSet.add(global.questionData.question)
    global.setFinishedQuestions(newSet)
    console.log(global.finishedQuestions.size)
    console.log(questions.size)
    if (global.finishedQuestions.size === questions.size - 1) {
        global.setScreen(Screen.winner)
    } else {
        global.setScreen(Screen.main)
    }
}

const QuestionScreen = () => {

    const global = useContext(ctx)

    if (global.screen !== Screen.question) {
        return null
    }

    const questionData = global.questionData

    return (
        <div>
            <div className="text-center text-4xl text-shadow-pink">
                {questionData.question}
            </div>
            <div className="h-0 border-dashed border-8 border-black mt-10 mb-10"></div>
            {global.showingAnswer &&
                <div>
                    <div className="text-center text-3xl text-shadow-amber">
                        What is {questionData.answer}?
                    </div>
                    <div className="grid grid-cols-2 gap-x-7 gap-y-7 content-start items-start mt-10">
                        <button onClick={() => {
                            const teamScore = global.currentPlayTeam ? global.team2Score : global.team1Score
                            const setTeamScore = global.currentPlayTeam ? global.setTeam2Score : global.setTeam1Score
                            setTeamScore(teamScore + questionData.score)
                            resetAfterPlay(global)
                        }}
                                className="text-center new-center text-black rounded-sm bg-amber-400 h-16 text-xl scale-100 transition drop-shadow-xl ease-in-out delay-75 hover:scale-105 hover:text-white hover:bg-pink-500 hover:drop-shadow-xl duration-300">
                            Correct!
                        </button>
                        <button onClick={() => {
                            const teamScore = global.currentPlayTeam ? global.team2Score : global.team1Score
                            const setTeamScore = global.currentPlayTeam ? global.setTeam2Score : global.setTeam1Score
                            setTeamScore(teamScore - questionData.score)
                            resetAfterPlay(global)
                        }}
                                className="text-center new-center text-black rounded-sm bg-amber-400 h-16 text-xl scale-100 transition drop-shadow-xl ease-in-out delay-75 hover:scale-105 hover:text-white hover:bg-pink-500 hover:drop-shadow-xl duration-300">
                            Incorrect.
                        </button>
                    </div>
                </div>
            }
            {!global.showingAnswer && <div className="text-center text-3xl text-shadow-amber">
                Press Enter to reveal answer.
            </div>}
        </div>
    )

}

const Question = (props: QuestionData) => {

    const global = useContext(ctx)
    const done = global.finishedQuestions.has(props.question)

    questions.add(props.question)
    questions.delete("")

    return (
        <div onClick={() => {
            if (!done) {
                global.setScreen(Screen.question)
                global.setQuestionData(props)
            }
        }}
             className="text-center new-center text-black decoration-white rounded-sm bg-amber-400 h-16 text-xl scale-100 transition drop-shadow-xl ease-in-out delay-75 hover:decoration-black hover:scale-105 hover:text-white hover:bg-pink-500 hover:drop-shadow-xl duration-300">
            {!done && props.score.toString(10)}
            {done && <div
                className="line-through decoration-2 decoration-inherit decoration-dotted">{props.score.toString(10)}</div>}
        </div>
    )
}

export default App;