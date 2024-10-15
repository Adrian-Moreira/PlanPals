import 'package:flutter/material.dart';
import 'package:planpals/features/travel_planner/models/destination_model.dart';
import 'package:planpals/shared/utils/date_utils.dart';

class DestinationCard extends StatelessWidget {
  final Destination destination;
  final VoidCallback onEdit;
  final VoidCallback onDelete;
  final bool functional;

  const DestinationCard(
      {super.key,
      required this.destination,
      required this.onEdit,
      required this.onDelete,
      required this.functional});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
          title: Text(destination.name, style: const TextStyle(fontWeight: FontWeight.bold)),
          subtitle: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                  'Departure: ${DateTimeFormat.formatDateTime(destination.startDate)}'),
              Text(
                  'Arrival: ${DateTimeFormat.formatDateTime(destination.endDate)}'),
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
