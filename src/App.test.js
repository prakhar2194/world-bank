import { render, screen } from '@testing-library/react';
import App from './App';
import {rest} from 'msw';
import {setupServer} from 'msw/node';

const fakeIncomeLevel = [
  {"page":"1","pages":"1","per_page":"50","total":"3"},
  [
    {"id":"HIC1","iso2code":"XD1","value":"High income1"},
    {"id":"INX1","iso2code":"XY1","value":"Not classified1"},
    {"id":"LIC1","iso2code":"XM1","value":"Low income1"},
  ]];

const fakeRegion= [
  {"page":"1","pages":"1","per_page":"50","total":"3"},
  [
    {"id":"","code":"code1","iso2code":"","name":"Africa1"},
    {"id":"","code":"code2","iso2code":"","name":"Arab"},
    {"id":"","code":"code3","iso2code":"","name":"Sub-Saharan"}
  ]];

const fakeLendingType= [
  {"page":"1","pages":"1","per_page":"50","total":"4"},
  [
    {"id":"ID1","iso2code":"123","value":"IBRD1"},
    {"id":"IB2","iso2code":"1234","value":"IBRD2"},
    {"id":"IX3","iso2code":"134","value":"IBRD3"},
    {"id":"LX4","iso2code":"145","value":"IBRD4"}
  ]];

const fakeCountry=[
  {"page":1,"pages":2,"per_page":"50","total":60},
  [
    {"id":"ABW","iso2Code":"AW","name":"Aruba","region":{"id":"LCN","iso2code":"ZJ","value":"Latin America & Caribbean "},"adminregion":{"id":"","iso2code":"","value":""},"incomeLevel":{"id":"HIC","iso2code":"XD","value":"High income"},"lendingType":{"id":"LNX","iso2code":"XX","value":"Not classified"},"capitalCity":"Oranjestad","longitude":"-70.0167","latitude":"12.5167"},
    {"id":"AFG","iso2Code":"AF","name":"Afghanistan","region":{"id":"SAS","iso2code":"8S","value":"South Asia"},"adminregion":{"id":"SAS","iso2code":"8S","value":"South Asia"},"incomeLevel":{"id":"LIC","iso2code":"XM","value":"Low income"},"lendingType":{"id":"IDX","iso2code":"XI","value":"IDA"},"capitalCity":"Kabul","longitude":"69.1761","latitude":"34.5228"},
    {"id":"AFR","iso2Code":"A9","name":"Africa","region":{"id":"NA","iso2code":"NA","value":"Aggregates"},"adminregion":{"id":"","iso2code":"","value":""},"incomeLevel":{"id":"LIC","iso2code":"XM","value":"Low income"},"lendingType":{"id":"IDX","iso2code":"XI","value":"IDA"},"capitalCity":"Kabul","longitude":"69.1761","latitude":"34.5228"}
  ]];

const server = setupServer(
  rest.get('http://api.worldbank.org/v2/incomelevel?format=json', (req, res, ctx) => {
    return res(ctx.json(fakeIncomeLevel))
  }),
  rest.get('http://api.worldbank.org/v2/region?format=json', (req, res, ctx) => {
    return res(ctx.json(fakeRegion))
  }),
  rest.get('http://api.worldbank.org/v2/lendingType?format=json', (req, res, ctx) => {
    return res(ctx.json(fakeLendingType))
  }),
  rest.get('http://api.worldbank.org/v2/country?format=json&page=1&per_page=50', (req, res, ctx) => {
    return res(ctx.json(fakeCountry))
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('renders the dropdown labels', () => {
  const incomeLevelLbl= "Income Level";
  const lendingTypeLbl= "Lending Type"
  const regionLbl= "Region"
  render(<App />);
  expect(screen.getByText(incomeLevelLbl)).toBeInTheDocument();
  expect(screen.getByText(lendingTypeLbl)).toBeInTheDocument()
  expect(screen.getByText(regionLbl)).toBeInTheDocument()
});

test('loads the income level data after api call', async () => {
  const incomeLevelDdlValues= ['High income1', 'Not classified1', 'Low income1'];
  render(<App />);
  await screen.findByText(incomeLevelDdlValues[0])

  expect(screen.getByText(incomeLevelDdlValues[0])).toBeInTheDocument();
  expect(screen.getByText(incomeLevelDdlValues[1])).toBeInTheDocument();
  expect(screen.getByText(incomeLevelDdlValues[2])).toBeInTheDocument();
})

test('loads the region data after api call', async () => {
  const regionValues= ['Africa1', 'Arab', 'Sub-Saharan'];

  render(<App />);
  await screen.findByText(regionValues[0])

  expect(screen.getByText(regionValues[0])).toBeInTheDocument();
  expect(screen.getByText(regionValues[1])).toBeInTheDocument();
  expect(screen.getByText(regionValues[2])).toBeInTheDocument();
})

test('loads the lendin type data after api call', async () => {
  const lendingTypeValues= ['IBRD1', 'IBRD2', 'IBRD3', 'IBRD4'];

  render(<App />);
  await screen.findByText(lendingTypeValues[0])

  expect(screen.getByText(lendingTypeValues[0])).toBeInTheDocument();
  expect(screen.getByText(lendingTypeValues[1])).toBeInTheDocument();
  expect(screen.getByText(lendingTypeValues[2])).toBeInTheDocument();
  expect(screen.getByText(lendingTypeValues[3])).toBeInTheDocument();
})

test('loads the grid with 4 rows if total 3 records are present', async () => {
  const { container } = render(<App />);
  await screen.findByTestId('worldBankTable');
  container.querySelectorAll('table')[0].querySelectorAll('tr').length

  expect(container.querySelectorAll('table')[0].querySelectorAll('tr').length).toEqual(4);
})

test('loads the pagnation component with 2 button and display 60, if total 60 records are present', async () => {
  const { container } = render(<App />);
  await screen.findByTestId('worldBankTable');
  container.querySelectorAll('table')[0].querySelectorAll('tr').length

  expect(document.querySelectorAll('nav')[0].querySelectorAll('li').length).toEqual(2);
  expect(screen.getByText('60')).toBeInTheDocument();
})
