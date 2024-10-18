class Accommodation {
  final String accommodationId;
  final String destinationId;
  final String name;
  final String address;
  final DateTime checkInDate; // Date as a string
  final DateTime checkOutDate; // Date as a string

  Accommodation({
    required this.accommodationId,
    required this.destinationId,
    required this.name,
    required this.address,
    required this.checkInDate,
    required this.checkOutDate,
  });

  // Factory method to create an Accommodation from a JSON map
  factory Accommodation.fromJson(Map<String, dynamic> json) {
    return Accommodation(
      accommodationId: json['accommodationId'] ?? '',
      destinationId: json['destinationId'] ?? '',
      name: json['name'] ?? '',
      address: json['address'] ?? '',
      checkInDate: DateTime.parse(json['checkInDate']), // Parsing DateTime
      checkOutDate: DateTime.parse(json['checkOutDate']), // Parsing DateTime
    );
  }

  // Method to convert Accommodation to JSON map
  Map<String, dynamic> toJson() {
    return {
      'accommodationId': accommodationId,
      'destinationId': destinationId,
      'name': name,
      'address': address,
      'checkInDate': checkInDate.toIso8601String(),
      'checkOutDate': checkOutDate.toIso8601String(),
    };
  }
}
