import 'package:flutter/material.dart';
import 'package:planpals/shared/utils/date_utils.dart';
import 'package:planpals/features/travel_planner/models/accommodation_model.dart';

class AccommodationCard extends StatelessWidget {
  final Accommodation accommodation;
  final VoidCallback onEdit;
  final VoidCallback onDelete;
  final bool functional;

  const AccommodationCard({
    super.key,
    required this.accommodation,
    required this.onEdit,
    required this.onDelete,
    required this.functional,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
          title: Text(accommodation.name),
          subtitle: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Addy: ${accommodation.address}'),
              Text(
                  '${accommodation.checkInDate} - ${accommodation.checkOutDate}'),
            ],
          ),
          trailing: functional
              ? Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.edit),
                      onPressed: onEdit, // Handle the edit logic
                    ),
                    IconButton(
                      icon: const Icon(Icons.delete),
                      onPressed: onDelete, // Handle the delete logic
                    ),
                  ],
                )
              : null),
    );
  }
}
