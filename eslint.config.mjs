// // eslint.config.ts
// // @ts-check
// import eslint from '@eslint/js';
// import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
// import globals from 'globals';
// import tseslint from 'typescript-eslint';

// export default tseslint.config(
//   {
//     ignores: ['eslint.config.mjs'],
//   },
//   eslint.configs.recommended,
//   ...tseslint.configs.recommendedTypeChecked,
//   eslintPluginPrettierRecommended,
//   {
//     languageOptions: {
//       globals: {
//         ...globals.node,
//         ...globals.jest,
//       },
//       sourceType: 'commonjs',
//       parserOptions: {
//         projectService: true,
//         tsconfigRootDir: import.meta.dirname,
//       },
//     },
//   },
//   {
//     rules: {
//       '@typescript-eslint/no-explicit-any': 'off', // Tắt cảnh báo với any
//       '@typescript-eslint/no-floating-promises': 'warn', // Cảnh báo khi có promise chưa xử lý
//       '@typescript-eslint/no-unsafe-argument': 'warn', // Cảnh báo với argument không an toàn
//       '@typescript-eslint/no-unsafe-call': 'off', // Tắt cảnh báo với unsafe call
//       '@typescript-eslint/no-unsafe-member-access': 'off', // ✅ Tắt cảnh báo khi truy cập member của any
//       '@typescript-eslint/explicit-module-boundary-types': 'off', // Tắt yêu cầu thêm kiểu trả về trong module boundaries
//       '@typescript-eslint/no-unused-vars': 'warn', // Cảnh báo khi có biến không được sử dụng
//       '@typescript-eslint/ban-ts-comment': 'warn', // Cảnh báo với comment ban ts
//       'prettier/prettier': [
//         'error',
//         {
//           endOfLine: 'auto', // Đảm bảo sự nhất quán của kết thúc dòng
//           semi: true, // Bắt buộc dùng dấu chấm phẩy
//           singleQuote: true, // Sử dụng dấu nháy đơn thay vì nháy kép
//           printWidth: 80, // Đặt độ rộng dòng tối đa
//         },
//       ],
//     },
//   },
// );
