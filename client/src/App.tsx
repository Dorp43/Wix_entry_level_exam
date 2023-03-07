import React from 'react';
import './components/styles/App.scss';
import { createApiClient, Ticket } from './api';
import { TicketContainer } from './components/TicketContainer';
import { PageRouter } from './components/PageRouter';
import { Filter } from './components/Filter';

export type AppState = {
	tickets?: Ticket[],
	resultedTickets: number,
	search: string;
	startDate: string;
	endDate: string;
	email: string;
	tags: string;
	currentPage: number;
	editedTicket: string;
	inputValue: string;
	reviewedTicket: string;
}

const api = createApiClient();



export class App extends React.PureComponent<{}, AppState> {

	constructor(props: {}) {
		super(props);
		this.handleFilterChange = this.handleFilterChange.bind(this);
	}

	state: AppState = {
		resultedTickets: 0,
		search: '',
		currentPage: 1,
		startDate: '',
		endDate: '',
		email: '',
		tags: '',
		editedTicket: '',
		inputValue: '',
		reviewedTicket: '',
	}



	searchDebounce: any = null;

	async componentDidMount() {
		await this.setTickets();
	}

	renderTickets = (tickets: Ticket[]) => {

		const filteredTickets = tickets
			.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()));


		return (<ul className='tickets'>
			{filteredTickets.map((ticket) => (<TicketContainer ticket={ticket} setTicketTitle={this.setTicketTitle} />))}
		</ul>);
	}

	setTicketTitle = (id: string, inputValue: string) => {
		const { tickets } = this.state;
		if (!tickets) {
			return; // exit early if tickets is undefined
		}
		const ticketIndex = tickets.findIndex(ticket => ticket.id === id);
		const updatedTicket = { ...tickets[ticketIndex], title: inputValue };
		const updatedTickets = [...tickets];
		updatedTickets[ticketIndex] = updatedTicket;
		this.setState({ tickets: updatedTickets });
		this.setState({ editedTicket: '' });
	};

	displayTicket = (ticket: Ticket) => {
		if (this.state.reviewedTicket === ticket.id) {
			this.setState({ reviewedTicket: '' });
		} else {
			this.setState({ reviewedTicket: ticket.id });
		}

	};

	onPageChange = (page: number) => {
		this.setState({ currentPage: page }, () => {
			this.setTickets();
		});
	};


	handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
	
		this.setState({ ...this.state, [name]: value, currentPage: 1 }, () => {
			this.setTickets();
		});
	}

	setTickets = async () => {

		clearTimeout(this.searchDebounce);

		const { search, currentPage, startDate, endDate, email, tags } = this.state;	

		this.searchDebounce = setTimeout(async () => {
			try {
				const ticketsData = await api.GetTickets(search, currentPage, startDate, endDate, email, tags);
				this.setState({
					tickets: ticketsData.tickets,
					resultedTickets: ticketsData.resultsFound
				});
			} catch (error) {
				console.error(error);
			}
		}, 300);
	}

	render() {
		const { tickets, resultedTickets, currentPage } = this.state;

		return (<main>
			<h1>Tickets List</h1>
			<Filter handleFilterChange={this.handleFilterChange} />
			{tickets ? <div className='results'>Found {resultedTickets} results</div> : null}
			{tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
			<PageRouter dataLength={resultedTickets} changePage={this.onPageChange} currentPage={currentPage} />
		</main>)
	}
}

export default App;