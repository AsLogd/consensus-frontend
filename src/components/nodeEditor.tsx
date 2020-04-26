import React from "react"
import { Node, NodeType, findChildrenCount } from "../data/argument/argument"

import "./nodeEditor.scss"

interface NodeEditorProps {
  node: Node
  save: (sentence: string, type: NodeType, childType: NodeType | null, href?: string, description?: string) => void
}

interface NodeEditorState {
  step: EditorStep
}

enum EditorStep {
  SENTENCE,
  HREF,
  DESCRIPTION,
  ADDNODE
}

export default class NodeEditor extends React.Component<NodeEditorProps, NodeEditorState> {
  constructor(props) {
    super(props)
    this.state = {
      step: EditorStep.SENTENCE
    }
  }

  updateSentence = (sentence: string) => {
    const node = this.props.node
    if (node.type === NodeType.SOURCE) {
      this.props.save(sentence, node.type, null, node.href, node.description)
    } else {
      this.props.save(sentence, node.type, null)
    } 
  }

  updateType = (type: NodeType) => {
    const node = this.props.node
    if (type === node.type) {
      return
    }
    if (node.type === NodeType.SOURCE) {
      this.props.save(node.sentence, type, null, node.href, node.description)
    } else {
      this.props.save(node.sentence, type, null)
    }
  }

  handleNextStep = () => {
    let nextStep = this.findNextStep()

    this.setState({
      step: nextStep
    })
  }

  findNextStep() : EditorStep {
    switch(this.state.step) {
      case EditorStep.SENTENCE: {
        return this.props.node.type === NodeType.SOURCE ? EditorStep.HREF : EditorStep.ADDNODE
      }
      case EditorStep.HREF: {
        return EditorStep.DESCRIPTION
      }
      case EditorStep.DESCRIPTION: {
        return EditorStep.ADDNODE
      }
      default: {
        return EditorStep.SENTENCE
      }
    }
  }

  addSourceChild = () => {
    const node = this.props.node
    const childrenCount = findChildrenCount(node)
    switch(node.type) {
      case NodeType.STATEMENT: {
        if (childrenCount > 0) {
          console.log("Can't add source children to statement with children")
          return
        } else {
          console.log("Updating statement node to fact and adding source child")
          this.props.save(node.sentence, NodeType.FACT, NodeType.SOURCE, "", "")
        }
        break
      }
      case NodeType.FACT: {
        console.log("Adding source child to Fact")
        this.props.save(node.sentence, NodeType.FACT, NodeType.SOURCE, "", "")
        break
      }
      case NodeType.SOURCE: {
        console.log("Can't add childs to sources")
        return
      }
    }
    this.handleNextStep()
  }

  addStatementChild = () => {
    const node = this.props.node
    const childrenCount = findChildrenCount(node)
    switch (node.type) {
      case NodeType.STATEMENT: {
        console.log("Adding statement child to Statement")
        this.props.save(node.sentence, NodeType.STATEMENT, NodeType.STATEMENT, "", "")
        break
      }
      case NodeType.FACT: {
        if (childrenCount > 0) {
          console.log("Can't add statement children to fact with children")
          return
        } else {
          console.log("Updating fact node to statement and adding statement child")
          this.props.save(node.sentence, NodeType.STATEMENT, NodeType.STATEMENT, "", "")
        }
        break
      }
      case NodeType.SOURCE: {
        console.log("Can't add childs to sources")
        return
      }
    }
    this.handleNextStep()
  }

  addSibling = () => {
    console.log("add sibling")
    return
  }

  renderNodePreview() {
    const node = this.props.node
    const childrenCount = findChildrenCount(node)

    return(
      <div className="node-editor__node-preview">
        <div className="node-editor__sentence">
          { node.sentence }
        </div>
        <div className="node-editor__children-count">
          { childrenCount }
        </div>
        <div className="node-editor__type">
          { NodeType[node.type] }
        </div>
        {
          node.type === NodeType.SOURCE &&
          <div>
            <div className="node-editor__href">
            { node.href }
            </div>
            <div className="node-editor__description">
            { node.description }
            </div>
          </div>  
        }
      </div>
    )
  }

  renderSentenceStep() {
    return(
      <div className="node-editor__actions">
        <div className="node-editor__message">
          Add a sentence
        </div>
        <input className="node-editor__sentence-input"
        value = {this.props.node.sentence}
        onChange = {e => this.updateSentence(e.target.value)}
        />
      </div>
    )
  }

  renderAddNodeStep() {
    const childrenCount = findChildrenCount(this.props.node)
    let childSource : boolean = true
    let childStatement : boolean = true

    if (this.props.node.type === NodeType.SOURCE) {
      // Sources can't have childs
      childSource = false
      childStatement = false
    } else if (this.props.node.type === NodeType.STATEMENT && childrenCount > 0) {
      // Statement with childs can only have statement childs
      childSource = false
    } else if (this.props.node.type === NodeType.FACT && childrenCount > 0) {
      // Facts with childs can only have source childs
      childStatement = false
    }

    return(
      <div className="node-editor__actions">
        <div className="node-editor__message">
          Add a Child or a Sibling
        </div>
        <div className="node-editor__add-node-buttons">
          { childSource && 
            <button 
            className="node-editor__child-source-button"
            onClick={this.addSourceChild}>
            ADD SOURCE CHILD
            </button> 
          }
          { childStatement && 
            <button 
            className="node-editor__child-statement-button"
            onClick={this.addStatementChild}>
            ADD STATEMENT CHILD
            </button> 
          }
          <button 
          className="node-editor__sibling-button"
          onClick={this.addSibling}>
          ADD SIBLING
          </button>
        </div>
      </div>
    )
  }

  renderNextStepButton() {
    return(
      <div className="node-editor__next-step">
        <div className="node-editor__current-step">
          { this.state.step }
        </div>
        <button className="node-editor__next-step-button" onClick={this.handleNextStep}>NEXT</button>
      </div>
    )
  }

  renderEditorActions() {
    switch(this.state.step) {
      case EditorStep.SENTENCE: {
        return this.renderSentenceStep()
      }
      case EditorStep.ADDNODE: {
        return this.renderAddNodeStep()
      }
      default: {
        return this.renderSentenceStep()
      }
    }
  }

  render() {
    return(
      <div className="node-editor-component">
        { this.renderNodePreview() }
        { this.renderEditorActions() }
        { this.renderNextStepButton() }
      </div>
    )
  }

}