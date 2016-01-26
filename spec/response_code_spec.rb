require_relative "../lib/response_code"

describe ResponseCode do
  describe "#code" do
    it "returns a 200 code if there is no override in the params" do
      response_code = ResponseCode.new {}
      expect(response_code.code).to be(200)
    end

    it "returns the expected code when in the params" do
      params = { "response_code" => 404 }
      response_code = ResponseCode.new params
      expect(response_code.code).to be(404)
    end
  end
end
