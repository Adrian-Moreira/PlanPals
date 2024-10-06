class Flight {
  final String flightNumber;
  final String departureAirport;
  final String arrivalAirport;
  final DateTime departureDateTime;
  final DateTime arrivalDateTime;
  final String travelPlanId;


  Flight({
    required this.flightNumber,
    required this.departureAirport,
    required this.arrivalAirport,
    required this.departureDateTime,
    required this.arrivalDateTime,
    required this.travelPlanId,
  });

  // Convert a Flight object into a JSON format.
  Map<String, dynamic> toJson() {
    return {
      'flightNumber': flightNumber,
      'departureAirport': departureAirport,
      'arrivalAirport': arrivalAirport,
      'departureDateTime': departureDateTime.toIso8601String(),
      'arrivalDateTime': arrivalDateTime.toIso8601String(),
      'travelPlanId': travelPlanId,
    };
  }

  // Create a Flight object from a Map.
  factory Flight.fromJson(Map<String, dynamic> json) {
    return Flight(
      flightNumber: json['flightNumber'],
      departureAirport: json['departureAirport'],
      arrivalAirport: json['arrivalAirport'],
      departureDateTime: DateTime.parse(json['departureDateTime']),
      arrivalDateTime: DateTime.parse(json['arrivalDateTime']),
      travelPlanId: json['travelPlanId'],
    );
  }
}
