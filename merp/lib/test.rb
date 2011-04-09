module A
  module B
    class Ctime
      s = self
      # puts s
      def initialize
        @id
      end
      attr_accessor :id
    end
  end
end


# puts A::B::Ctime.id.nil?
# puts nil.kind_of? NilClass
# puts nil.class
# puts "".class

class Test
  @@ga = 1

  def s 
    Test.ga = 4
  end

  class << self
    def ga=(ga)
      @ga = ga
    end
    def ga
      @@ga
    end
  end
end

# puts Test.ga
Test.ga = 3
puts Test.ga
puts Test.new.s
puts Test.ga
