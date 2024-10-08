import 'package:flutter/material.dart';
import 'package:planpals/features/travel_planner/views/components/Forms/accommodation_form.dart';
import 'package:planpals/features/travel_planner/views/components/Forms/activity_form.dart';
import 'package:planpals/features/travel_planner/views/components/Forms/flight_form.dart';
import 'package:planpals/features/travel_planner/views/components/cards/accommodation_card.dart';
import 'package:planpals/features/travel_planner/views/components/cards/activity_card.dart';
import 'package:planpals/features/travel_planner/views/components/cards/flight_card.dart';
import 'package:planpals/features/travel_planner/views/travel_planners_view.dart';
import 'package:planpals/shared/components/error_message_screen.dart';
import 'package:planpals/features/travel_planner/models/travel_planner_model.dart';
import 'package:planpals/shared/components/generic_list_view.dart';
import 'package:planpals/shared/components/invite_user_dialog.dart';
import 'package:planpals/shared/constants/constants.dart';
import 'package:planpals/shared/utils/date_utils.dart';

class TravelPlannerDetailsView extends StatelessWidget {
  final TravelPlanner travelPlanner;
  const TravelPlannerDetailsView({super.key, required this.travelPlanner});

  final bool functional = true;

  @override
  Widget build(BuildContext context) {
    return
        // check if travelPlanner is null
        // ignore: unnecessary_null_comparison
        travelPlanner == null
            // if null, display error message for null travel planner
            ? const ErrorMessageScreen(
                errorMessage: ErrorMessage.nullTravelPlanner,
                appBarTitle: '',
              )

            // else display travel planner details
            : _buildTravelPlanner(context, travelPlanner);
  }

  Widget _buildTravelPlanner(
      BuildContext context, TravelPlanner travelPlanner) {
    return Scaffold(
      appBar: AppBar(
        
        actions: <Widget>[
          PopupMenuButton<String>(
            icon: Icon(Icons.menu),
            onSelected: (String result) {
              // Handle menu item selection
              print('Selected: $result');
            },
            itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
              const PopupMenuItem<String>(
                value: 'Profile',
                child: Text('Profile'),
              ),
              const PopupMenuItem<String>(
                value: 'Settings',
                child: Text('Settings'),
              ),
              const PopupMenuItem<String>(
                value: 'Logout',
                child: Text('Logout'),
              ),
            ],
          ),
        ],
      ),
      body: CustomScrollView(
        slivers: [
          // Sliver app bar
          const SliverAppBar(
            expandedHeight: 250.0,
            flexibleSpace: FlexibleSpaceBar(
              background: Icon(
                Icons.image,
                size: 200,
              ),
              centerTitle: true,
            ),
            backgroundColor: Color.fromRGBO(122, 22, 124, 1.0),
          ),

          SliverToBoxAdapter(
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ListTile(
                    title: Text(
                      travelPlanner.destination,
                      style: const TextStyle(fontSize: 40),
                    ),
                    subtitle: Text(
                        '${DateTimeFormat.formatDate(travelPlanner.startDate)} - ${DateTimeFormat.formatDate(travelPlanner.endDate)}'),
                    trailing: IconButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) =>
                                  InviteUserDialog()), // navigate to travel planners
                        );
                      },
                      icon: const Icon(
                        Icons.group_add,
                        size: 40,
                      ),
                    ),
                  ),
                  ListTile(
                    leading: Container(
                      padding:
                          const EdgeInsets.all(10), // Padding around the icon
                      decoration: BoxDecoration(
                        color: const Color.fromARGB(
                            255, 223, 223, 223), // Background color
                        borderRadius:
                            BorderRadius.circular(8), // Rounded corners
                      ),
                      child: const Icon(
                        Icons.calendar_month,
                        size: 30, // Icon size // Icon color
                      ),
                    ),
                    title: Text(
                        '${travelPlanner.endDate.difference(travelPlanner.startDate).inDays} Days'),
                    subtitle:
                        Text('${travelPlanner.activities.length} activities'),
                  ),
                  ListTile(
                    leading: Container(
                      padding:
                          const EdgeInsets.all(10), // Padding around the icon
                      decoration: BoxDecoration(
                        color: const Color.fromARGB(
                            255, 223, 223, 223), // Background color
                        borderRadius:
                            BorderRadius.circular(8), // Rounded corners
                      ),
                      child: const Icon(
                        Icons.group_rounded,
                        size: 30, // Icon size // Icon color
                      ),
                    ),
                    title: const Text('Members'),
                    subtitle: const Text('Todo: List # of members or names'),
                  ),
                  GenericListView(
                    itemList: travelPlanner.flights,
                    itemBuilder: (flight) => FlightCard(
                      flight: flight,
                      onEdit: () {},
                      onDelete: () {},
                      functional: functional,
                    ),
                    onAdd: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => FlightForm(
                                  onFlightAdd: (Flight) {},
                                )), // navigate to Flight Form
                      );
                    },
                    headerTitle: "Flights",
                    headerIcon: Icons.airplanemode_active,
                    emptyMessage: "There is no flight",
                    functional: functional,
                  ),
                  const SizedBox(
                    height: 20,
                  ),
                  const Divider(height: 1),
                  const SizedBox(
                    height: 10,
                  ),
                  GenericListView(
                    itemList: travelPlanner.accommodations,
                    itemBuilder: (accommodation) => AccommodationCard(
                      accommodation: accommodation,
                      onEdit: () {},
                      onDelete: () {},
                      functional: functional,
                    ),
                    onAdd: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => AccommodationForm(
                                  onAccommodationAdd: (Accommodation) {},
                                )), // navigate to Accommodations
                      );
                    },
                    headerTitle: "Accommodations",
                    headerIcon: Icons.hotel,
                    emptyMessage: "There is no accommodation",
                    functional: functional,
                  ),
                  const SizedBox(
                    height: 20,
                  ),
                  const Divider(height: 1),
                  const SizedBox(
                    height: 10,
                  ),
                  GenericListView(
                    itemList: travelPlanner.activities,
                    itemBuilder: (activity) => ActivityCard(
                      activity: activity,
                      onEdit: () {},
                      onDelete: () {},
                      functional: functional,
                    ),
                    onAdd: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => ActivityForm(
                                  onActivityAdd: (Activity) {},
                                )), // navigate to activity
                      );
                    },
                    headerTitle: "Activities",
                    headerIcon: Icons.event,
                    emptyMessage: "There is no activity",
                    functional: functional,
                  ),
                  const SizedBox(
                    height: 20,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
