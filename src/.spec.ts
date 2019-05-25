/* tslint:disable:no-unused-expression no-empty */

import * as chai from 'chai'
// import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import * as chaiAsPromised from 'chai-as-promised'

import * as Odayo from '.'
let odayo = Odayo

chai.use(sinonChai)
chai.use(chaiAsPromised)

const expect = chai.expect

describe('Container', function () {
  it('true should be true', function () {

    expect(true).to.be.true
  })
})