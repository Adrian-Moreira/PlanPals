import 'package:flutter/material.dart';
import 'package:planpals/shared/utils/date_utils.dart';
import 'package:planpals/features/travel_planner/models/activity_model.dart';

class ActivityCard extends StatelessWidget {
  final Activity activity;
  final VoidCallback onEdit;
  final VoidCallback onDelete;
  final bool functional;

  const ActivityCard(
      {super.key,
      required this.activity,
      required this.onEdit,
      required this.onDelete,
      required this.functional});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
          title: Text(activity.name),
          subtitle: 
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Date: ${DateTimeFormat.formatDateTime(activity.date)}',),
              Text('Duration: ${activity.duration} minutes',),
            ]
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
