import 'package:planpals/features/vote/vote_model.dart';
import 'package:planpals/shared/utils/date_utils.dart';

class Accommodation {
  final String accommodationId;
  final String destinationId;
  final String createdBy;
  String name;
  String address;
  DateTime checkInDate; // Date as a string
  DateTime checkOutDate; // Date as a string
  Vote vote;

  Accommodation({
    required this.accommodationId,
    required this.destinationId,
    required this.name,
    required this.address,
    required this.checkInDate,
    required this.checkOutDate,
    required this.createdBy,
    Vote? vote, // make this parameter nullable
  }) : vote = vote ?? Vote(createdBy: createdBy, id: '', objectId: accommodationId, type: 'Accommodation', upVotes: [], downVotes: []);

  // Factory method to create an Accommodation from a JSON map
  factory Accommodation.fromJson(Map<String, dynamic> json) {
    return Accommodation(
      accommodationId: json['_id'] ?? '',
      destinationId: json['destinationId'] ?? '',
      name: json['name'] ?? '',
      address: json['location'] ?? '',
      checkInDate: DateTime.parse(json['startDate']), // Parsing DateTime
      checkOutDate: DateTime.parse(json['endDate']), // Parsing DateTime
      createdBy: json['createdBy'] ?? '',
    );
  }

  // Method to convert Accommodation to JSON map
  Map<String, dynamic> toJson() {
    return {
      '_id': accommodationId,
      'destinationId': destinationId,
      'name': name,
      'location': address,
      'startDate': DateTimeToIso.formatToUtcIso(checkInDate),
      'endDate': DateTimeToIso.formatToUtcIso(checkOutDate),
      'createdBy': createdBy,
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
        '  createdBy: $createdBy\n'
        '}';
  }

  void update(Accommodation updatedAccommodation) {
    name = updatedAccommodation.name;
    address = updatedAccommodation.address;
    checkInDate = updatedAccommodation.checkInDate;
    checkOutDate = updatedAccommodation.checkOutDate;
  }
}
