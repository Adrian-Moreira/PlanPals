// import 'package:flutter/material.dart';
// import 'package:planpals/features/travel_planner/models/transport_model.dart';
// import 'package:planpals/features/travel_planner/services/transport_service.dart';

// class TransportViewModel extends ChangeNotifier {
//   final TransportService _transportService = TransportService();

//   // State variables
//   List<Transport> _transports = [];
//   Transport? _selectedTransport;
//   String? _errorMessage;
//   bool _isLoading = false;

//   // Getters
//   List<Transport> get transports => _transports;
//   Transport? get selectedTransport => _selectedTransport;
//   String? get errorMessage => _errorMessage;
//   bool get isLoading => _isLoading;

//   // Fetch all transports
//   Future<void> fetchAllTransports(String plannerId, {List<String>? transportIds}) async {
//     _isLoading = true;
//     notifyListeners();

//     try {
//       _transports = await _transportService.fetchAllTransports(plannerId, transportIds: transportIds);
//       _errorMessage = null; // Clear any previous error messages
//     } catch (e) {
//       _errorMessage = e.toString();
//     } finally {
//       _isLoading = false;
//       notifyListeners();
//     }
//   }

//   // Fetch transport by ID
//   Future<void> fetchTransportById(String plannerId, String transportId) async {
//     _isLoading = true;
//     notifyListeners();

//     try {
//       _selectedTransport = await _transportService.fetchTransportById(plannerId, transportId);
//       _errorMessage = null; // Clear any previous error messages
//     } catch (e) {
//       _errorMessage = e.toString();
//       _selectedTransport = null; // Reset the selected transport on error
//     } finally {
//       _isLoading = false;
//       notifyListeners();
//     }
//   }

//   // Add a new transport
//   Future<void> addTransport(String plannerId, Transport transport) async {
//     _isLoading = true;
//     notifyListeners();

//     try {
//       await _transportService.addTransport(plannerId, transport);
//       _errorMessage = null; // Clear any previous error messages
//       // Optionally, you can fetch all transports again to refresh the list
//       await fetchAllTransports(plannerId);
//     } catch (e) {
//       _errorMessage = e.toString();
//     } finally {
//       _isLoading = false;
//       notifyListeners();
//     }
//   }
// }
