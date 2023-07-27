import 'should';
import sinon from 'sinon';
import request from 'supertest';
import { odata, host, port, assertSuccess } from '../../support/setup';
import data from '../../support/books.json';
import FakeDb from '../../support/fake-db';
import { BookModel } from '../../support/books.model';

describe('odata.query.filter.functions', function () {
  const query = {
    $where: () => { },
    where: () => { },
    gte: () => { },
    lt: () => { },
    exec: () => { },
    model: BookModel
  };
  let httpServer, modelMock, queryMock;

  before(async function () {
    const server = odata();

    server.mongoEntity('book', BookModel);
    httpServer = server.listen(port);
  });

  after(() => {
    httpServer.close();
  });

  afterEach(() => {
    modelMock?.restore();
    queryMock?.restore();
  });

  describe('[contains]', () => {
    it('should filter items', async function () {
      const books = data.filter(item => item.title.indexOf('i') >= 0);

      modelMock = sinon.mock(BookModel);
      queryMock = sinon.mock(query);
      modelMock.expects('find').once().returns(query);
      queryMock.expects('$where').once().withArgs(`this.title.indexOf('i') != -1`);
      queryMock.expects('exec').once().callsArgWith(0, null, books.map(item => ({ toObject: () => item })));

      const res = await request(host).get(`/book?$filter=contains(title,'i')`);

      assertSuccess(res);
      modelMock.verify();
      queryMock.verify();
      res.body.should.deepEqual({
        value: books
      });
    });
    it('should filter items when it has extra spaces in query string', async function () {
      const books = data.filter(item => item.title.indexOf('Visual Studio') >= 0);

      modelMock = sinon.mock(BookModel);
      queryMock = sinon.mock(query);
      modelMock.expects('find').once().returns(query);
      queryMock.expects('$where').once().withArgs(`this.title.indexOf('Visual Studio') != -1`);
      queryMock.expects('exec').once().callsArgWith(0, null, books.map(item => ({ toObject: () => item })));

      const res = await request(host).get(`/book?$filter=contains(title,'Visual Studio')`);

      assertSuccess(res);
      modelMock.verify();
      queryMock.verify();
      res.body.should.deepEqual({
        value: books
      });
    });
  });

  describe('[indexof]', () => {
    it('should filter items', async function () {
      const books = data.filter(item => item.title.indexOf('i') >= 1);

      modelMock = sinon.mock(BookModel);
      queryMock = sinon.mock(query);
      modelMock.expects('find').once().returns(query);
      queryMock.expects('$where').once().withArgs(`this.title.indexOf('i') >= 1`);
      queryMock.expects('exec').once().callsArgWith(0, null, books.map(item => ({ toObject: () => item })));

      const res = await request(host).get(`/book?$filter=indexof(title,'i') ge 1`);

      assertSuccess(res);
      modelMock.verify();
      queryMock.verify();
      res.body.should.deepEqual({
        value: books
      });
    });
    it('should filter items when it has extra spaces in query string', async function () {
      const books = data.filter(item => item.title.indexOf('Visual Studio') >= 0);

      modelMock = sinon.mock(BookModel);
      queryMock = sinon.mock(query);
      modelMock.expects('find').once().returns(query);
      queryMock.expects('$where').once().withArgs(`this.title.indexOf('Visual Studio') >= 0`);
      queryMock.expects('exec').once().callsArgWith(0, null, books.map(item => ({ toObject: () => item })));

      const res = await request(host).get(`/book?$filter=indexof(title,'Visual Studio') ge 0`);

      assertSuccess(res);
      modelMock.verify();
      queryMock.verify();
      res.body.should.deepEqual({
        value: books
      });
    });
  });

  describe('[year]', () => {
    it('should filter items', async function () {
      const books = data.filter(item => item.publish_date >= new Date(2000, 0, 1) && item.publish_date < new Date(2001, 0, 1));

      modelMock = sinon.mock(BookModel);
      queryMock = sinon.mock(query);
      modelMock.expects('find').once().returns(query);
      queryMock.expects('where').once().withArgs(`publish_date`).returns(query);
      queryMock.expects('gte').once().withArgs(new Date(2000, 0, 1)).returns(query);
      queryMock.expects('lt').once().withArgs(new Date(2001, 0, 1)).returns(query);
      queryMock.expects('exec').once().callsArgWith(0, null, books.map(item => ({ toObject: () => item })));

      const res = await request(host).get(`/book?$filter=year(publish_date) eq 2000`);

      assertSuccess(res);
      modelMock.verify();
      queryMock.verify();
      res.body.should.deepEqual({
        value: books
      });
    });
  });
});