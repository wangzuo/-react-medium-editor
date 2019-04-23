import React from 'react';
import ReactDOM from 'react-dom';

if (typeof document !== 'undefined') {
  var MediumEditor = require('medium-editor');
}

export default class ReactMediumEditor extends React.Component {
  static defaultProps = {
    tag: 'div'
  };

  constructor(props) {
    super(props);

    this.state = {
      text: this.props.text
    };
  }

  componentDidMount() {
    this.dom = ReactDOM.findDOMNode(this);

    this.medium = new MediumEditor(this.dom, this.props.options);
    this.medium.subscribe('editableInput', e => {
      this._updated = true;
      this.change(this.dom.innerHTML);
    });
  }

  componentDidUpdate() {
    this.medium.restoreSelection();
  }

  componentWillUnmount() {
    this.medium.destroy();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.text !== this.dom.innerHTML;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.text !== this.state.text && !this._updated) {
      this.setState({ text: nextProps.text });
    }

    if (this._updated) this._updated = false;
  }

  render() {
    const {
      options,
      text,
      tag,
      contentEditable,
      dangerouslySetInnerHTML,
      ...props
    } = this.props;
    props.dangerouslySetInnerHTML = { __html: this.state.text };

    if (this.medium) {
      this.medium.saveSelection();
    }

    return React.createElement(tag, props);
  }

  change(text) {
    if (this.props.onChange) this.props.onChange(text, this.medium);
  }
}
