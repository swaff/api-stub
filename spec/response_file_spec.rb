require_relative "../lib/response_file"

describe ResponseFile do
  describe "#name" do

    context "path only (no query params or custom file name)" do
      it "returns the expected path with the default file name" do
        response_file = ResponseFile.new('/api/books')
        expect(response_file.name).to eq('api/books/index.json')
      end

      it "handes a trailing slash on the URL path" do
        response_file = ResponseFile.new('/api/books/')
        expect(response_file.name).to eq('api/books/index.json')
      end

      it "ensures lower case" do
        response_file = ResponseFile.new('/Api/bOOks/')
        expect(response_file.name).to eq('api/books/index.json')
      end
    end

    context "path with query params (no custom file name)" do
      it "converts the query params into a nested file heirarchy" do
        params = { "a" => 1, "b" => 2 }
        response_file = ResponseFile.new('/api', params)
        expected_name = "api/params/a-1/b-2/index.json"
        expect(response_file.name).to eq(expected_name)
      end

      it "excludes ignored params" do
        params = { "one" => "1", "two" => "2", "three" => "3" }
        ignored = %w(three)
        response_file = ResponseFile.new('/api', params, ignored)
        expected_name = "api/params/one-1/two-2/index.json"
        expect(response_file.name).to eq(expected_name)
      end

      it "alphabetically sorts the query params" do
        params = { "zoo" => "1", "farm" => "2" }
        response_file = ResponseFile.new('/api', params)
        expected_name = "api/params/farm-2/zoo-1/index.json"
        expect(response_file.name).to eq(expected_name)
      end

      it "removes spaces" do
        params = { "game" => "hungry hippos" }
        response_file = ResponseFile.new('/api', params)
        expected_name = "api/params/game-hungryhippos/index.json"
        expect(response_file.name).to eq(expected_name)
      end

      it "ensures lower case" do
        params = { "Fruit" => "APplE" }
        response_file = ResponseFile.new('/api', params)
        expected_name = "api/params/fruit-apple/index.json"
        expect(response_file.name).to eq(expected_name)
      end
    end

    context "path with custom file name (no query params)" do
      it "ignores an empty response_file value in the params" do
        params = { "response_file" => "" }
        ignored = %w(response_file)
        response_file = ResponseFile.new('/api', params, ignored)
        expected_name = "api/index.json"
        expect(response_file.name).to eq(expected_name)
      end

      it "uses the response_file value when present" do
        params = { "response_file" => "test" }
        ignored = %w(response_file)
        response_file = ResponseFile.new('/api', params, ignored)
        expected_name = "api/test.json"
        expect(response_file.name).to eq(expected_name)
      end
    end

    context "path, query params and custom file" do
      it "creates a filename with all the variables" do
        params = { "response_file" => "test", "one" => "1" }
        ignored = %w(response_file)
        response_file = ResponseFile.new('/api', params, ignored)
        expected_name = "api/params/one-1/test.json"
        expect(response_file.name).to eq(expected_name)
      end

      it "ensures lower case" do
        params = { "NUmbeR" => "ONE", "response_file" => "TesT" }
        ignored = %w(response_file)
        response_file = ResponseFile.new('/api', params, ignored)
        expected_name = "api/params/number-one/test.json"
        expect(response_file.name).to eq(expected_name)
      end
    end
  end
end
