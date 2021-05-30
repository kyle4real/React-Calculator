import { useState } from "react";
import commas from "../utilities/commas";
import precision from "../utilities/precision";

import clearAudio from "./../sound_effects/clear.mp3";
import equalsAudio from "./../sound_effects/equals.mp3";
import numsAudio from "./../sound_effects/nums.mp3";

const Calculator = () => {
    const [outputValue, setOutputValue] = useState(0);
    const [firstNum, setFirstNum] = useState(null);
    const [secondNum, setSecondNum] = useState(null);
    const [operator, setOperator] = useState(null);
    const [prevEquation, setPrevEquation] = useState(null);

    const handleNum = (num) => {
        if (!secondNum && !operator) {
            operatorVisual(operator, false);
            if (num === "0" && firstNum === "0") return;
            num = !firstNum ? num : firstNum + num;
            setOutputValue(num);
            setFirstNum(num);
            return;
        }
        if (firstNum && operator) {
            operatorVisual(operator, false);
            if (num === "0" && secondNum === "0") return;
            num = !secondNum ? num : secondNum + num;
            setOutputValue(num);
            setSecondNum(num);
            return;
        }
    };

    const handleOperator = (e) => {
        if (!firstNum && e === "add") {
            handleNum("0");
            setOperator(e);
            operatorVisual(e, true);
            return;
        }
        if (!firstNum && e === "subtract") {
            setOutputValue("-0");
            setFirstNum("-");
        }
        // if (firstNum === "-") return;
        if (!firstNum) return;
        if (firstNum && !secondNum) {
            if (operator && e === "subtract") {
                setOutputValue("-0");
                setSecondNum("-");
                operatorVisual(e, false);
                return;
            }
            setOperator(e);
            operatorVisual(e, true);
            return;
        } else if (firstNum && secondNum === "-") {
            if (e === "subtract") return;
            setSecondNum(null);
            setOperator(e);
            operatorVisual(e, true);
            return;
        }
        if (firstNum && secondNum) {
            handleEquals();
            setOperator(e);
            operatorVisual(e, true);
            return;
        }
    };
    const operatorVisual = (e, on) => {
        if (on) {
            if (document.querySelector(".currentOp")) {
                document.querySelector(".currentOp").classList.remove("currentOp");
            }
            document.getElementById(e).classList.add("currentOp");
        } else {
            if (document.querySelector(".currentOp")) {
                document.getElementById(e).classList.remove("currentOp");
            }
        }
    };

    const handleDecimal = () => {
        var num;
        // check if first num
        if (!secondNum && !operator) {
            if (firstNum && firstNum.includes(".")) return;
            num = !firstNum ? `0.` : firstNum + ".";
            setOutputValue(num);
            setFirstNum(num);
            return;
        }
        if (firstNum && operator) {
            if (secondNum && secondNum.includes(".")) return;
            num = !secondNum ? "0." : secondNum + ".";
            setOutputValue(num);
            setSecondNum(num);
            return;
        }
    };

    const handleEquals = () => {
        const a = parseFloat(firstNum);
        const b = parseFloat(secondNum);
        var answer;
        if (!operator) return;
        // if (operator && !secondNum) answer = firstNum + firstNum;
        switch (operator) {
            case "add":
                answer = isNaN(b) ? a + a : a + b;
                break;
            case "subtract":
                answer = isNaN(b) ? a - a : a - b;
                break;
            case "divide":
                answer = isNaN(b) ? a / a : a / b;
                break;
            case "multiply":
                answer = isNaN(b) ? a * a : a * b;
                break;
            default:
                answer = 10000;
        }
        setFirstNum(precision(answer));
        setOperator(null);
        setSecondNum(null);
        setOutputValue(precision(answer));
        // visuals
        operatorVisual(operator, false);
        // prev equation
        const equation = `${firstNum && commas(firstNum)} ${operators[operator]} ${
            commas(secondNum) || commas(firstNum)
        } = `;
        setPrevEquation(equation);
    };

    const handleClear = () => {
        setFirstNum(null);
        setOperator(null);
        setSecondNum(null);
        setOutputValue(0);
        // visuals
        operatorVisual(operator, false);
        // pre equation
        setPrevEquation(null);
    };

    const handleInput = (e) => {
        inputVisual(e.id);
        switch (e.id) {
            case "zero":
            case "one":
            case "two":
            case "three":
            case "four":
            case "five":
            case "six":
            case "seven":
            case "eight":
            case "nine":
                inputSound(numsAudio);
                handleNum(e.innerText);
                break;
            case "add":
            case "subtract":
            case "divide":
            case "multiply":
                inputSound(numsAudio);
                handleOperator(e.id);
                break;
            case "decimal":
                inputSound(numsAudio);
                handleDecimal();
                break;
            case "equals":
                inputSound(equalsAudio);
                handleEquals();
                break;
            case "clear":
                inputSound(clearAudio);
                handleClear();
                break;
            default:
                return;
        }
    };

    const inputSound = (type) => {
        var audio = new Audio(type);
        audio.pause();
        audio.currentTime = 0;
        audio.play();
    };

    const inputVisual = (id) => {
        const ele = document.getElementById(id).classList;
        ele.add("currentInput");
        setTimeout(() => {
            ele.remove("currentInput");
        }, 100);
    };

    const operators = {
        add: "+",
        subtract: "-",
        multiply: "*",
        divide: "/",
    };

    return (
        <div className="calculator">
            <div className="display-container">
                <div className="display">
                    <div className="display-operation">
                        <div className="operation-firstnum">
                            {prevEquation && prevEquation}
                            {firstNum && commas(firstNum)}
                        </div>
                        <div className="operation-operator">{operators[operator]}</div>
                        <div className="operation-secondnum">{secondNum && commas(secondNum)}</div>
                    </div>
                    <div className="display-output" id="display">
                        {outputValue === 0 ? 0 : commas(outputValue)}
                    </div>
                </div>
            </div>
            <div className="keypad-container">
                <div className="keys-grid" id="keyPad">
                    <div className="clear pad" id="clear" onClick={(e) => handleInput(e.target)}>
                        AC
                    </div>
                    <div
                        className="divide pad op"
                        id="divide"
                        onClick={(e) => handleInput(e.target)}
                    >
                        /
                    </div>
                    <div
                        className="multiply pad op"
                        id="multiply"
                        onClick={(e) => handleInput(e.target)}
                    >
                        x
                    </div>
                    <div
                        className="subtract pad op"
                        id="subtract"
                        onClick={(e) => handleInput(e.target)}
                    >
                        -
                    </div>
                    <div className="add pad op" id="add" onClick={(e) => handleInput(e.target)}>
                        +
                    </div>
                    <div className="equals pad" id="equals" onClick={(e) => handleInput(e.target)}>
                        =
                    </div>
                    <div className="zero pad" id="zero" onClick={(e) => handleInput(e.target)}>
                        0
                    </div>
                    <div className="one pad" id="one" onClick={(e) => handleInput(e.target)}>
                        1
                    </div>
                    <div className="two pad" id="two" onClick={(e) => handleInput(e.target)}>
                        2
                    </div>
                    <div className="three pad" id="three" onClick={(e) => handleInput(e.target)}>
                        3
                    </div>
                    <div className="four pad" id="four" onClick={(e) => handleInput(e.target)}>
                        4
                    </div>
                    <div className="five pad" id="five" onClick={(e) => handleInput(e.target)}>
                        5
                    </div>
                    <div className="six pad" id="six" onClick={(e) => handleInput(e.target)}>
                        6
                    </div>
                    <div className="seven pad" id="seven" onClick={(e) => handleInput(e.target)}>
                        7
                    </div>
                    <div className="eight pad" id="eight" onClick={(e) => handleInput(e.target)}>
                        8
                    </div>
                    <div className="nine pad" id="nine" onClick={(e) => handleInput(e.target)}>
                        9
                    </div>
                    <div
                        className="decimal pad"
                        id="decimal"
                        onClick={(e) => handleInput(e.target)}
                    >
                        .
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calculator;
