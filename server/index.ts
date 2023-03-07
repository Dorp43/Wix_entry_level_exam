import express from 'express';
import bodyParser = require('body-parser');
import { tempData } from './temp-data';
import { serverAPIPort, APIPath } from '@fed-exam/config';
import { TicketsData } from '../client/src/api';

console.log('starting server', { serverAPIPort, APIPath });

const app = express();

const PAGE_SIZE = 20;

app.use(bodyParser.json());

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.get(APIPath, (req, res) => {
  console.log(req.query);
  // @ts-ignore
  const page: number = req.query.page || 1;
  const searchTerm: string | undefined = req.query.search as string | undefined;
  const startDate: string | undefined = req.query.after as string | undefined;
  const endDate: string | undefined = req.query.before as string | undefined;
  const email: string | undefined = req.query.from as string | undefined;
  const tags: string | undefined = req.query.tags as string | undefined;

  let filteredData = tempData;

  if (searchTerm) {
    filteredData = tempData.filter((ticket) => {
      return ticket.title.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

  if (startDate) {
    const startDateTime = new Date(startDate).getTime();
    filteredData = filteredData.filter((ticket) => {
      const ticketDateTime = new Date(ticket.creationTime).getTime();
      return ticketDateTime >= startDateTime;
    });
  }

  if (endDate) {
    const endDateTime = new Date(endDate).getTime();
    filteredData = filteredData.filter((ticket) => {
      const ticketDateTime = new Date(ticket.creationTime).getTime();
      return ticketDateTime <= endDateTime;
    });
  }

  if (email) {
    filteredData = tempData.filter((ticket) => {
      return ticket.userEmail.toLowerCase().includes(email.toLowerCase());
    });
  }

  if (tags) {
    let tagsList = tags.split(',').map(tag => tag.toLowerCase());
    filteredData = tempData.filter((ticket) => {
      if (ticket.labels !== undefined){
        return ticket.labels.some(r => tagsList.indexOf(r.toLowerCase()) >= 0)
      } 
    });
  }


  const resultsFound = filteredData.length;

  const resultedTickets = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const ticketsData: TicketsData = {
    tickets: resultedTickets,
    resultsFound: resultsFound
  };
  
  res.send(ticketsData);

});


app.listen(serverAPIPort);
console.log('server running', serverAPIPort)

