import 'package:flutter/material.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/travel_planner/models/destination_model.dart';
import 'package:planpals/features/travel_planner/viewmodels/planner_viewmodel.dart';
import 'package:planpals/features/travel_planner/views/components/Forms/update/update_accommodation_form.dart';
import 'package:planpals/shared/components/delete_message.dart';
import 'package:planpals/shared/utils/date_utils.dart';
import 'package:planpals/features/travel_planner/models/accommodation_model.dart';
import 'package:provider/provider.dart';

class AccommodationCard extends StatelessWidget {
  final Destination destination;
  final Accommodation accommodation;
  final VoidCallback onEdit;
  final VoidCallback onDelete;
  final bool functional;

  const AccommodationCard({
    super.key,
    required this.accommodation,
    required this.onEdit,
    required this.onDelete,
    required this.functional, required this.destination,
  });

  @override
  Widget build(BuildContext context) {
    PlannerViewModel plannerViewModel = Provider.of<PlannerViewModel>(context, listen: false);
    User user = Provider.of<UserViewModel>(context, listen: false).currentUser!;
    
    return Card(
      child: ListTile(
          title: Text(accommodation.name),
          subtitle: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Addy: ${accommodation.address}'),
              Text(
                  '${DateTimeFormat.formatDateTime(accommodation.checkInDate)} - ${DateTimeFormat.formatDateTime(accommodation.checkOutDate)}'),
            ],
          ),
          trailing: functional
              ? Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.edit),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => UpdateAccommodationForm(
                                    accommodation: accommodation, destination: destination,
                                  )),
                        );
                      }, // Handle the edit logic
                    ),
                    IconButton(
                      icon: const Icon(Icons.delete),
                      onPressed: () {
                        showDialog(
                          context: context, 
                          builder: (context) => DeleteMessage(onDelete: () {
                            
                            // Delete Transport
                            plannerViewModel.deleteAccommodation(accommodation, destination.plannerId, user.id);

                            if (plannerViewModel.errorMessage != null) {
                              ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                                content: Text(plannerViewModel.errorMessage!),
                              ));
                            } else {
                              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                                content: Text('Accommodation deleted successfully!'),
                              ));

                              destination.accommodationList.remove(accommodation);
                            }

                          }));

                      }, // Handle the delete logic
                    ),
                  ],
                )
              : null),
    );
  }
}
