import React, { ChangeEvent } from 'react';
import './styles/ticket.scss';
import { Ticket } from '../api';

interface Props {
  ticket: Ticket;
  setTicketTitle: (id: string, inputValue: string) => void;
}

interface State {
  showSeeMore: boolean;
  inputValue: string;
  editTicketTitle: boolean;
  expandTicket: boolean;
  shortenContent: string;
}

export class TicketContainer extends React.Component<Props, State> {
  private contentRef: React.RefObject<HTMLParagraphElement>;

  constructor(props: Props) {
    super(props);
    this.contentRef = React.createRef();
    this.state = { showSeeMore: false, inputValue: '', editTicketTitle: false, expandTicket: false, shortenContent: ''};
  }

  componentDidMount() {
    // Check if "See more" button is needed after the component mounts
    this.checkContentHeight();
  }


  checkContentHeight =() => {
    const content = this.contentRef.current;
    const {ticket} = this.props;
    if (content) {
      const maxHeight = 100; // Set maximum height for content
      const contentHeight = content.scrollHeight;
      if (contentHeight > maxHeight) {
        this.setState({ showSeeMore: true });
        this.setState({ shortenContent: ticket.content })
      } else {
        this.setState({ showSeeMore: false });
      }
    }
  }

  handleSeeMoreClick = () => {
    alert("test");
  }


  editTitle = () => {
    const { ticket } = this.props;
    this.setState({ editTicketTitle: true })
    this.setState({ inputValue: ticket.title });
  }


  updateInputValue = (evt: ChangeEvent<HTMLInputElement>) => {
    const val = evt.target.value;
    this.setState({
      inputValue: val
    });
  }




  handleTitleChange = () => {
    const { ticket, setTicketTitle } = this.props;
    const { inputValue } = this.state;
    setTicketTitle(ticket.id, inputValue);
    this.setState({ editTicketTitle: false });
  }

  displayTicket = () => {
    this.setState({expandTicket: !this.state.expandTicket});
  }

  render() {
    const { ticket } = this.props;
    const { expandTicket, inputValue, editTicketTitle, showSeeMore } = this.state;

    return (
      <li key={ticket.id} className='ticket'>
        {editTicketTitle ? (
          <div className='title-editor'>
            <input type="text" className='title_input' autoFocus value={inputValue} onChange={evt => this.updateInputValue(evt)} />
            <div className='title-editor-tools'>
              <span className='confirm-title-btn' onClick={() => this.handleTitleChange()}>&#x2714;</span>
              <span className='deny-title-btn' onClick={() => this.setState({ editTicketTitle: false })}>&#x2716;</span>
            </div>
          </div>
        ) : (
          <h5 className='title'>{ticket.title}<span className='rename-btn' onClick={() => this.editTitle()}>&#x270E;</span></h5>
        )}
        <p className={'content ' + (expandTicket ? 'content-expanded' : 'content-narrowed')} ref={this.contentRef}>
          {ticket.content}
        </p>
        <footer className='ticket-meta-data'>
          <div className='tags-container'>
            {ticket.labels ?
              ticket.labels.map(label => (
                <span>{label}</span>
              )) : null}
          </div>
          <div className='meta-data'>By: {ticket.userEmail} | Created: {new Date(ticket.creationTime).toLocaleString()}</div>
          {showSeeMore && (expandTicket ? (
            <div className='resize-btn-container'><span className='resize-btn' onClick={() => this.displayTicket()}> See less</span></div>
          ) : (
            <div className='resize-btn-container'><span className='resize-btn' onClick={() => this.displayTicket()}> See more</span></div>))}
        </footer>
      </li>
    )
  }
};