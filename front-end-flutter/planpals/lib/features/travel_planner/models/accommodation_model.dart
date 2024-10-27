class Accommodation {
  final String accommodationId;
  final String destinationId;
  String name;
  String address;
  DateTime checkInDate; // Date as a string
  DateTime checkOutDate; // Date as a string

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

  @override
  String toString() {
    return 'Accommodation {\n'
        '  accommodationId: $accommodationId,\n'
        '  destinationId: $destinationId,\n'
        '  name: $name,\n'
        '  address: $address,\n'
        '  checkInDate: $checkInDate,\n'
        '  checkOutDate: $checkOutDate\n'
        '}';
  }

  void update(Accommodation updatedAccommodation) {
    name = updatedAccommodation.name;
    address = updatedAccommodation.address;
    checkInDate = updatedAccommodation.checkInDate;
    checkOutDate = updatedAccommodation.checkOutDate;
  }
}
