import 'package:flutter/material.dart';
import 'package:planpals/core/utils/date_utils.dart';
import 'package:planpals/features/travel_planner/models/flight_model.dart';

class FlightCard extends StatelessWidget {
  final Flight flight;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  const FlightCard({
    super.key, 
    required this.flight, 
    required this.onEdit, 
    required this.onDelete
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        title: Row (
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Text(flight.departureAirport),
            const SizedBox(width: 5,),
            const Icon(Icons.arrow_forward_rounded),
            const SizedBox(width: 5,),
            Text(flight.arrivalAirport),
        ],),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Arrival: ${formatDateTime(flight.arrivalDateTime)}'),
            Text('Departure: ${formatDateTime(flight.departureDateTime)}'),
          ],
        ),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            IconButton(
              icon: const Icon(Icons.edit),
              onPressed: onEdit,  // Handle the edit logic
            ),
            IconButton(
              icon: const Icon(Icons.delete),
              onPressed: onDelete,  // Handle the delete logic
            ),
          ],
        ),
      ),
    );
  }
}
