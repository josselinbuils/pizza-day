import { PizzaDayPage } from './app.po';

describe('pizza-day App', () => {
  let page: PizzaDayPage;

  beforeEach(() => {
    page = new PizzaDayPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
