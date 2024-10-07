class Accommodation {
  final String accommodationId;
  final String name;
  final String address;
  final DateTime checkIn;
  final DateTime checkOut;
  final String pricePerNight;
  final String travelPlanId;

  Accommodation({
    required this.accommodationId,
    required this.name,
    required this.address,
    required this.checkIn,
    required this.checkOut,
    required this.pricePerNight,
    required this.travelPlanId,
  });

  // Convert an Accommodation object into a Map.
  Map<String, dynamic> toJson() {
    return {
      'accommodationId': accommodationId,
      'name': name,
      'address': address,
      'checkIn': checkIn,
      'checkOut': checkOut,
      'pricePerNight': pricePerNight,
      'travelPlanId': travelPlanId,
    };
  }

  // Create an Accommodation object from a Map.
  factory Accommodation.fromJson(Map<String, dynamic> json) {
    return Accommodation(
      accommodationId: json['accommodationId'],
      name: json['name'],
      address: json['address'],
      checkIn: json['checkIn'],
      checkOut: json['checkOut'],
      pricePerNight: json['pricePerNight'],
      travelPlanId: json['travelPlanId'],
    );
  }
}
