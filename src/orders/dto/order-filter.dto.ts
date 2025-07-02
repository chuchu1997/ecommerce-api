import { Controller, Get, Query } from '@nestjs/common';
import { IsOptional, IsBoolean, IsInt, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * DTO for order filter parameters
 */
export class OrderFilterDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isToday?: boolean; // Filter orders created within the last 24 hours

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isThisWeek?: boolean; // Filter orders created within the last 7 days

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isThisMonth?: boolean; // Filter orders created within the current month

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isCanceled?: boolean; // Filter canceled orders

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isSent?: boolean; // Filter sent orders

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isCompleted?: boolean; // Filter completed orders

  @IsNumber()
  @Transform(({ value }) =>
    value !== undefined ? parseInt(value, 10) : undefined,
  )
  currentPage: number;

  @IsNumber()
  @Transform(({ value }) =>
    value !== undefined ? parseInt(value, 10) : undefined,
  )
  limit: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  userId?: number;
}
