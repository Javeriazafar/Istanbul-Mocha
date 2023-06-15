// Import necessary libraries
/*jshint expr: true*/

var expect = require('chai').expect;
var sinon = require('sinon');
var rewire = require('rewire');
let chai = require('chai');
let chaiHttp = require('chai-http');
//const codeToBeTested = require('../test.api');
chai.use(chaiHttp);
// Import the code to be tested
var jsFile = '../test.api.js';

global.context = {
	getVariable: function(s) {},
	setVariable: function(s) {}
};

global.httpClient = {
	send: function(s) {}
};

global.Request = function(s) {};

var contextGetVariableMethod, contextSetVariableMethod;
var httpClientSendMethod;
var requestConstructor;

beforeEach(function () {
	contextGetVariableMethod = sinon.stub(context, 'getVariable');
	contextSetVariableMethod = sinon.stub(context, 'setVariable');
	//sinon.spy(object, "method") creates a spy that wraps the existing function object.method. The spy will behave exactly like the original method (including when used as a constructor)
	requestConstructor = sinon.spy(global, 'Request');
	httpClientSendMethod = sinon.stub(httpClient, 'send');
});

afterEach(function() {
	contextGetVariableMethod.restore();
	contextSetVariableMethod.restore();
	requestConstructor.restore();
	httpClientSendMethod.restore();
});

describe('Apigee Code', () => {

 
  // Define test cases
  it('should check all the parameters', async () => {
    // Stub the httpClient.send method

    contextGetVariableMethod.withArgs('message.content').returns(JSON.stringify({ emailId: 'example@example.com', roles: { role: [{ organization: 'org1', role: 'role1' }] } }))
    contextGetVariableMethod.withArgs('message.header.Authorization').returns('BasicAuthHeader')
    //postRequestHeaders.returns({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'BasicAuthHeader'})
    var errorThrown = false;
    try { requireUncached(jsFile);} catch (e) { errorThrown = true; }
    expect(errorThrown).to.equal(false);
    
    expect(httpClientSendMethod.calledOnce).to.be.true;  // true.to.be.true
    expect(requestConstructor.calledOnce).to.be.true;
    var requestConstructorArgs = requestConstructor.args[0];
    expect(requestConstructorArgs[0]).to.equal('http://10.21.180.112:4041/v1/organizations/testorg/userroles/admin/users');		
    expect(requestConstructorArgs[1]).to.equal('GET');		
    expect(requestConstructorArgs[2]['Authorization']).to.equal('basicAuth');	 
  });

  it('API hit test ', (done) => {
    
    chai.request('https://catfact.ninja')
        .get('/fact')
        .end((err, res) => {
          console.log(res.text)
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.have.header('content-type', 'application/json');
          //When done is passed in, Mocha will wait until the call to done():
          //which signal that the callback has completed, and the assertions can be verified
          done();
        })
  });
});

function requireUncached(module){
	//  the require.resolve use(es) the internal require() machinery to look up the location of a module, but rather than loading the module, just return(s) the resolved filename.
    delete require.cache[require.resolve(module)];
    return require(module);
}

