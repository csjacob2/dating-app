$(document).ready(function() {
    $('button.btn.search').click(function(e){
        //prevent reloading of page when pressing enter in the search box
        e.preventDefault();

        var searchTerm = $('input.search').val();

        profile.clearResults();
        profile.clearProfile();
        profile.searchProfiles(searchTerm);

        // clear search box after conducting search
        $('input.search').val('');
    });

    $('button.btn.logout').click(function(){
        // code for logout here
    });

    $('section.details .close').on('click', function(){
        //hide the profile in mobile view
        profile.hideProfile();
    });
});


var profile = (function() {

    function _clearResults() {
        $('.profiles .searchResults li').remove();
        $('.profiles p.found').html('');
    }

    function _searchProfiles(searchTerm) {
        // search profile data

        var foundProfiles = [];
        searchTerm = searchTerm.trim().toLowerCase();

        getProfileData()
            .then(function(data){

                foundProfiles = data.People.filter(function(obj) {
                    var n = obj.name.trim().toLowerCase().search(searchTerm);
                    if (n != -1) {
                        return obj;
                    }
                });

                displayResults(foundProfiles);
        }, function(error) {
            console.error("failed to load profiles!", error);
        });
    }

    function getProfileData(){
        // get profile data from json file

        var profileData = {};

        return new Promise(function(resolve, reject) {
            $.getJSON('people.json', function(data) {
                profileData = data;
            })
            .done(function() {
                resolve(profileData);
            })
            .fail(function() {
                reject('error, can\'t find file');
            });
        });
    }

    function displayResults(searchResults) {
        // build search results list
        // this should be done in a template

        const li = '<li class="profile"></li>';

        for (let index in searchResults) {
            var profileId = 'profileId-'+index;

            $('.profiles .searchResults').append(li);
            $('.profiles .searchResults li').last().attr('id', profileId);
            $('.profiles .searchResults li#'+profileId).html(searchResults[index].name);
            attachClickHandler(profileId, searchResults[index]);
        }

        $('.profiles .found').html(searchResults.length +' profile(s) found.')
    }

    function displayProfile(profile) {
        // display profile of a single contact when selected
        //this should also be outlined in a template

        $('section.details').animate({'left': '-1200px'});
        _clearProfile();

        $('.profile_details .profile_name').html(profile.name);
        $('.profile_details .profile_image').attr('src', profile.img).attr('alt', profile.name);
        $('.profile_details .profile_desc').html(profile.Description);
        calculateRating(profile.rating);

        //build the likes/dislikes table
        var likes, dislikes, table_row;
        var tableLength = Math.max(profile.Likes.length, profile.Dislikes.length);

        for (let i = 0; i < tableLength; i++) {
            if (profile.Likes[i] !== undefined) {
                likes = profile.Likes[i];
            } else {
                likes = '&nbsp;'
            }
            if (profile.Dislikes[i] !== undefined) {
                dislikes = profile.Dislikes[i];
            } else {
                dislikes = '&nbsp;'
            }

            table_row = '<tr class="traits"><td>' + likes +'</td><td>'+ dislikes + '</td></tr>';
            $('table.profile_traits').append(table_row);
        }

        $('section.details').animate({'left': '0'});
    }

    function _hideProfile() {
        // hide profile overlay in mobile view

        $('section.details').animate({'left': '-1200px'});
        $('.profiles .searchResults li.selected').removeClass('selected');
    }

    function attachClickHandler(profileId, profileData) {
        //helper function to attach click handler to search results to display contact details

        $('.profiles .searchResults li#'+profileId).on('click', function(){
            $('.profiles .searchResults li.selected').removeClass('selected');
            $(this).toggleClass('selected');

            displayProfile(profileData);
        });
    }

    function calculateRating(ratingValue) {
        //helper function to calculate and display heart rating
        // can be adjusted to have a different max value and rating symbol

        const maxValue = 5;
        const ratingSymbol = '♥&#xFE0E;';                   // fix for "Unicode variation selector" to prevents the symbol from rendering as emoji on mobile
        const span = '<span>'+ratingSymbol+'</span>';

        for (let i = 1; i <= maxValue; i++) {
            $('.profile_details .profile_rating').append(span);

            // add class to turn rating on or off
            if (i <= ratingValue) {
                $('.profile_details .profile_rating span').last().addClass('on');
            } else {
                $('.profile_details .profile_rating span').last().addClass('off');
            }
        }
    }

    function _clearProfile() {
        // clear out contents of profile so new contents can be placed in
        $('section.details').animate({'left': '-1200px'});
        $('table.profile_traits tr.traits').remove();
        $('.profile_details .profile_rating span').remove();
    }

    return {
        clearResults:       _clearResults,
        clearProfile:       _clearProfile,
        hideProfile:        _hideProfile,
        searchProfiles:     _searchProfiles
    }
})();