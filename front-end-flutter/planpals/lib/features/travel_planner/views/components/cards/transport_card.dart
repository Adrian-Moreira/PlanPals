import 'package:flutter/material.dart';
import 'package:planpals/features/travel_planner/models/transport_model.dart';
import 'package:planpals/shared/utils/date_utils.dart';

class TransportCard extends StatelessWidget {
  final Transport transport;
  final VoidCallback onEdit;
  final VoidCallback onDelete;
  final bool functional;

  const TransportCard(
      {super.key,
      required this.transport,
      required this.onEdit,
      required this.onDelete,
      required this.functional});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
          title: Text(transport.type, style: const TextStyle(fontWeight: FontWeight.bold)),
          subtitle: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                  'Departure: ${DateTimeFormat.formatDateTime(transport.departureTime)}'),
              Text(
                  'Arrival: ${DateTimeFormat.formatDateTime(transport.arrivalTime)}'),
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
