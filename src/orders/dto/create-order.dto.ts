export class CreateOrderDto {
  orderNumber: string;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderItemDto[];
  payment: PaymentDto;
}

export class PaymentDto {
  method: PaymentMethod; // Phương thức thanh toán
  status: PaymentStatus; // Trạng thái thanh toán
  isPaid: boolean; // Đã thanh toán hay chưa
  bankName?: string; // Tên ngân hàng (nếu chuyển khoản)

  payerName?: string; // Tên người chuyển (nếu chuyển khoản)

  // Thông tin chuyển khoản
  paymentTimestamp?: Date; // Thời gian chuyển khoản (nếu chuyển khoản)
  orderId: number;

  transactionId?: string; // Mã giao dịch thanh toán
}

export class OrderItemDto {
  productId: number;
  quantity: number;
  price: number;
}
export enum OrderStatus {
  ORDERED = 'ORDERED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
}
export enum PaymentStatus {
  PENDING, // Đang chờ thanh toán
  COMPLETED, // Đã thanh toán
  FAILED, // Thanh toán thất bại
  CANCELED, // Đã hủy thanh toán
}

export enum PaymentMethod {
  COD, // Thanh toán khi nhận hàng
  BANK_TRANSFER, // Chuyển khoản ngân hàng
}
