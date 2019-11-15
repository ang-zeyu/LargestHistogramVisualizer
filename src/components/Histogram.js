import React from 'react';
import './Histogram.css';

//self contained Histogram max area algorithm visualizer
//with accompanying css file

class Histogram extends React.Component {

    state = { hist:[], indexStack:[], progState:'uninitialized', count:0, maxarea:0, codeCount:null};

    onMaxInputChange = (event) => {
        console.log(event.target.value);
        const maxHeight = event.target.value;
        let histogram = [];
        for (let i = 0; i < 10; i++) {
            const height = Math.ceil(Math.random() * maxHeight) + 1;
            histogram[i] =  height > maxHeight ? maxHeight : height;
        }

        this.setState({ hist:histogram, indexStack:[], progState:'running', count:0, maxarea:0, currarea:0});
    }

    updateStack = () => {
        if (this.state.indexStack.length !== 0) {
            return this.state.indexStack.map((index, key) => {
                return (
                    <p key={key} class="histogramStackElement">
                        Index:{index} || Value: {this.state.hist[index]}
                    </p>);
                }).reverse();
        }
    }

    updateHistogram() {
        return this.state.hist.map((bar, index) => {
            const height = bar * 10;
            let inStack = false;
            for (const i of this.state.indexStack) {
                inStack = inStack || i === index;
            }
            if (index === this.state.count) {
                return <div>
                        <div key={index} className="histogramBar" style={{height:height, backgroundColor:'green'}}>{bar}</div>
                        <div className="histogramIndex">{index}</div>
                    </div>;
            } else if (inStack) {
                return <div>
                        <div key={index} className="histogramBar" style={{height:height, backgroundColor:'purple'}}>{bar}</div>
                        <div className="histogramIndex">{index}</div>
                    </div>;
            }
            return <div>
                    <div key={index} className="histogramBar" style={{height:height}}>{bar}</div>
                    <div className="histogramIndex">{index}</div>
                </div>;
            });
    }


    //execute only upon clicking next, lest infinite setState recursion happens
    updateProgramNext = () => {
        //main logic of program
        //0 for initialization
        //1 for running

        let indexStack = this.state.indexStack;

        if (this.progState === 'uninitialized') {
            //do nothing
        } else if (this.state.progState === 'running') {
            let tp = this.state.indexStack[this.state.indexStack.length - 1];

            if (this.state.indexStack.length === 0
                || (this.state.hist[tp] <= this.state.hist[this.state.count])) {

                const z = this.state.count;
                if (z + 1 <= 10) {
                    this.setState({count: z + 1, indexStack: indexStack.concat([z]), codeCount:1});
                } else {
                    this.setState({progState:"finished"});
                }
            } else if (this.state.count <= 10) {

                let calcArea = this.state.hist[tp] *
                    (this.state.indexStack.length === 1
                        ? this.state.count
                        : this.state.count - this.state.indexStack[this.state.indexStack.length - 2] - 1);
                this.setState(
                    {indexStack: indexStack.filter((curr, ind) => { return ind !== (this.state.indexStack.length - 1); }),
                        maxarea: this.state.maxarea > calcArea ? this.state.maxarea : calcArea,
                        currarea: `${calcArea} = ${this.state.hist[tp]} * (${this.state.count} - \
                            ${this.state.indexStack.length === 1 ? 0 : this.state.indexStack[this.state.indexStack.length - 2]}\
                            - ${this.state.indexStack.length === 1 ? 0 : 1})`,
                        codeCount: this.state.count === 10 ? 3 : 2
                    });

            }

        }
    }

    render() {
        return (
            <div className="histogramContainer">
                <form className="histogramInputRow">
                    <label htmlFor="histInputMax">Input histogram max: </label>
                    <input onChange={this.onMaxInputChange} name="histogramInput" type="number" id="histInputMax" />
                </form>
                <div className="histogramIndexStack">
                    {this.updateStack()}
                </div>
                <div className="histogramCurrent">
                    Area: {this.state.currarea}<br />
                    Count: {this.state.count}<br />
                    MaxArea: {this.state.maxarea}<br />
                    Program State: {this.state.progState}
                </div>
                <div className="histogramControl">
                    <button type="button" onClick={this.updateProgramNext}>Step</button>
                </div>
                <div className="histogramBarDisplay">
                    {this.updateHistogram()}
                </div>
                <code className="javaCode">
                    How to use: <br/>
                    <ul>
                        <li><span style={{color:'blue'}}>Blue</span> highlighted code is code that was just <b>executed</b>.</li>
                        <li><span style={{color:'green'}}>Green</span> bar denotes the next bar <b>yet</b> to be added to stack.</li>
                        <li><span style={{color:'purple'}}>Purple</span> bar(s) denotes bars <b>currently</b> in stack.</li>
                        <li>Simply input the max value (recommended:10-30) above, the visualizer uses values of 2 - max for the bars.</li>
                    </ul><br/>
                       Java code of the O(n) largest rectangle area under histogram sourced from GeeksForGeeks. <br/>
                           &copy;github.com/ang-zeyu<br/>--------------------------------------------------<br/>
                    {`Stack<Integer> s = new Stack<>();

                    int max_area = 0;
                    // To store top of stack index
                    int tp;
                    // To store area with top bar as the smallest bar
                    int area_with_top;
                //
                    int i = 0;

                    `.split('\n').map((line,key) => {
                        return <div key={key}
                            style={{color:line.trim().charAt(0) === '/' ? 'black' : 'rgb(231,62,141)'}}>{line}</div>;})}
                    <br />
                    {`
                    while (i < n) {
                        // If this bar is higher than the bar on top stack, push it to stack
                        //
                        if (s.empty() || hist[s.peek()] <= hist[i])
                            s.push(i++);
                            // Note we push the index of the bar, not the height of the bar!!!!!!!

                        // If this bar is lower than top of stack, then calculate area of rectangle
                        // with stack top as the smallest (or minimum height) bar. 'i' is
                        // 'right index' for the top and element before top in stack is 'left index'
                        else
                        {
                            // store the top index
                            tp = s.pop();

                            // Calculate the area with hist[tp] stack as smallest bar
                            area_with_top = hist[tp] * (s.empty() ? i : i - s.peek() - 1);

                            // update max area, if needed
                            if (max_area < area_with_top)
                                max_area = area_with_top;
                        }
                    }
                    ---------------------------------------------------------------------------------------------
                    // Now pop the remaining bars from stack and calculate area with every
                    // popped bar as the smallest bar
                    while (s.empty() == false)
                    {
                        tp = s.pop();

                        area_with_top = hist[tp] * (s.empty() ? i : i - s.peek() - 1);

                        if (max_area < area_with_top)
                            max_area = area_with_top;
                    }
                    `.split('\n').map((line,key) => {
                        console.log(line);
                        return <div
                            key={key}
                            style={{color:
                                line.trim().charAt(0) === "/"
                                    ? "black"
                                    : (this.state.codeCount === 1 && key < 7 && key > 1) ||
                                        (this.state.codeCount === 2 && key < 22 && key > 6) ||
                                        (this.state.codeCount === 3 && key > 26)
                                        ? "blue"
                                        : "rgb(231,62,141)"}}>{line}</div>;
                        })
                    }
                </code>
            </div>
        );
    }
}

export default Histogram;
