export interface ProductItem {
  id: string;
  productId: string;
  itemType: "MOCK_TEST" | "PRACTICE_SET" | "COURSE";
  itemId: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  items?: ProductItem[];
}

export interface Purchase {
  id: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  paymentRefId?: string;
  razorpayOrderId?: string;
  amount: number;
  amountPaid: number;
  paymentGateway?: string;
  product: Product;
  createdAt: string;
}

export interface Question {
  id: string;
  text: string;
  formatType?: string;
}

export interface MockTestSectionQuestion {
  question: Question;
}

export interface MockTestSection {
  id: string;
  name: string;
  questions: MockTestSectionQuestion[];
}

export interface MockTest {
  id: string;
  title: string;
  sections: MockTestSection[];
}

export interface PracticeSetQuestion {
  question: Question;
}

export interface PracticeSet {
  id: string;
  title: string;
  questions: PracticeSetQuestion[];
}
