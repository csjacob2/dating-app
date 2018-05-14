$(document).ready(function() {
    $('.btn_search').click(function(e){
        e.preventDefault();

        var searchTerm = $('input.search').val();

        profile.clearResults();
        profile.clearProfile();
        profile.searchProfiles(searchTerm);
        $('input.search').val('');
    })
});



var profile = (function() {

    function _clearResults() {
        $('.profiles .searchResults li').remove();
        $('p.found').remove();
    }

    function _getProfileData(){
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

    function _searchProfiles(searchTerm) {
        var foundProfiles = [];
        searchTerm = searchTerm.trim().toLowerCase();

        _getProfileData()
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

    function displayResults(searchResults) {
        const li = '<li class="profile"></li>';

        for (let index in searchResults) {
            var profileId = 'profileId-'+index;

            $('.profiles .searchResults').append(li);
            $('.profiles .searchResults li').last().attr('id', profileId);
            $('.profiles .searchResults li#'+profileId).html(searchResults[index].name);
            attachClickHandler(profileId, searchResults[index]);
        }

        $('.profiles').append('<p class="found">'+ searchResults.length +' profile(s) found.</p>')
    }

    function displayProfile(profile) {
        _clearProfile();

        $('section.details .profile_image').attr('src', profile.img);
        $('section.details .profile_desc').html(profile.Description);
        calculateRating(profile.rating);

        var likes, dislikes, table_row, evenOdd=false;
        //build the table (this is icky, I don't think this should be a table structure?)
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

            evenOdd = !evenOdd;

            table_row = '<tr class="traits"><td class="'+(evenOdd ? 'odd' : 'even')+'">' + likes +'</td><td>'+ dislikes + '</td></tr>';
            $('table.profile_traits').append(table_row);
        }
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
        const ratingSymbol = '&hearts;';
        const span = '<span>'+ratingSymbol+'</span>';

        for (let i = 1; i <= maxValue; i++) {
            $('section.details .profile_rating').append(span);

            // add class to turn rating on or off
            if (i <= ratingValue) {
                $('section.details .profile_rating span').last().addClass('on');
            } else {
                $('section.details .profile_rating span').last().addClass('off');
            }
        }
    }

    function _clearProfile() {
        $('table.profile_traits tr.traits').remove();
        $('section.details .profile_image').attr('src', '');
        $('section.details .profile_desc').html('');
        $('section.details .profile_rating span').remove();
    }

    return {
        clearResults:       _clearResults,
        clearProfile:       _clearProfile,
        getProfileData:     _getProfileData,
        searchProfiles:     _searchProfiles
    }
})();