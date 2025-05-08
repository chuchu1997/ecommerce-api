export class CreateOrderDto {
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
  id?: number; // ID của sản phẩm (nếu có)
  orderId: number; // ID của đơn hàng (nếu có)
  unitPrice: number; // Giá đơn vị của sản phẩm
  subtotal: number; // Tổng giá của sản phẩm (quantity * unitPrice)
  productId: number;
  quantity: number;
  price: number;
}
export enum OrderStatus {
  ORDERED = 'ORDERED', // Đã đặt hàng
  PROCESSING = 'PROCESSING', // Chờ chuyển phát
  SHIPPED = 'SHIPPED', // Đang trung chuyển
  DELIVERED = 'DELIVERED', // Đã giao
  CANCELED = 'CANCELED', // Đã hủy
}
export enum PaymentStatus {
  PENDING = 'PENDING', // Đang chờ thanh toán
  COMPLETED = 'COMPLETED', // Đã thanh toán
  FAILED = 'FAILED', // Thanh toán thất bại
  CANCELED = 'CANCELED', // Đã hủy thanh toán
}

export enum PaymentMethod {
  COD = 'COD', // Thanh toán khi nhận hàng
  BANK_TRANSFER = 'BANK_TRANSFER', // Chuyển khoản ngân hàng
}
