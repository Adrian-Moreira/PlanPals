import 'package:flutter/material.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/travel_planner/models/destination_model.dart';
import 'package:planpals/features/travel_planner/viewmodels/planner_viewmodel.dart';
import 'package:planpals/features/travel_planner/views/components/Forms/update/update_activity_form.dart';
import 'package:planpals/shared/components/delete_message.dart';
import 'package:planpals/shared/components/generic_card.dart';
import 'package:planpals/shared/utils/date_utils.dart';
import 'package:planpals/features/travel_planner/models/activity_model.dart';
import 'package:provider/provider.dart';

class ActivityCard extends StatelessWidget {
  final Destination destination;
  final Activity activity;
  final VoidCallback onEdit;
  final VoidCallback onDelete;
  final bool functional;

  const ActivityCard(
      {super.key,
      required this.activity,
      required this.onEdit,
      required this.onDelete,
      required this.functional,
      required this.destination});

  @override
  Widget build(BuildContext context) {
    PlannerViewModel plannerViewModel = Provider.of<PlannerViewModel>(context);
    User user = Provider.of<UserViewModel>(context).currentUser!;

    return GenericCard(
      title: Text(activity.name,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 20)),
      subtitle: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Date: ${DateTimeFormat.formatDateTime(activity.startDate)}'),
          Text('Duration: ${activity.duration} minutes'),
        ],
      ),
      onDelete: () {
        _handleDelete(context, plannerViewModel, user);
      },
      onEdit: () {
        _handleEdit(context);
      },
      vote: activity.vote,
      functional: functional,
    );
  }

  void _handleDelete(
      BuildContext context, PlannerViewModel plannerViewModel, User user) {
    showDialog(
        context: context,
        builder: (context) => DeleteMessage(onDelete: () {
              // Delete Activity
              plannerViewModel.deleteActivity(
                  activity, destination.plannerId, user.id);

              if (plannerViewModel.errorMessage != null) {
                ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                  content: Text(plannerViewModel.errorMessage!),
                ));
              } else {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                  content: Text('Activity deleted successfully!'),
                ));

                destination.activityList.remove(activity);
              }
            }));
  }

  void _handleEdit(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => UpdateActivityForm(
          activity: activity,
          destination: destination,
        ),
      ),
    );
  }
}
