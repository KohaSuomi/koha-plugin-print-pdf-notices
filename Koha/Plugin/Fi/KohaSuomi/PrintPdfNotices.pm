package Koha::Plugin::Fi::KohaSuomi::PrintPdfNotices;

## It's good practice to use Modern::Perl
use Modern::Perl;

## Required for all plugins
use base qw(Koha::Plugins::Base);
## We will also need to include any Koha libraries we want to access
use C4::Context;
use utf8;
use JSON;

## Here we set our plugin version
our $VERSION = "1.2.0";

## Here is our metadata, some keys are required, some are optional
our $metadata = {
    name            => 'Tulosta ilmoituksia',
    author          => 'Johanna Räisä',
    date_authored   => '2021-10-29',
    date_updated    => '2021-05-16',
    minimum_version => '21.11',
    maximum_version => '',
    version         => $VERSION,
    description     => 'Tulosta ilmoituksia',
};

## This is the minimum code required for a plugin's 'new' method
## More can be added, but none should be removed
sub new {
    my ( $class, $args ) = @_;

    ## We need to add our metadata here so our base class can access it
    $args->{'metadata'} = $metadata;
    $args->{'metadata'}->{'class'} = $class;

    ## Here, we call the 'new' method for our base class
    ## This runs some additional magic and checking
    ## and returns our actual 
    my $self = $class->SUPER::new($args);

    return $self;
}
## This is the 'install' method. Any database tables or other setup that should
## be done when the plugin if first installed should be executed in this method.
## The installation method should always return true if the installation succeeded
## or false if it failed.
sub install() {
    my ( $self, $args ) = @_;

    return 1;
}

## This is the 'upgrade' method. It will be triggered when a newer version of a
## plugin is installed over an existing older version of a plugin
sub upgrade {
    my ( $self, $args ) = @_;

    return 1;
}

## This method will be run just before the plugin files are deleted
## when a plugin is uninstalled. It is good practice to clean up
## after ourselves!
sub uninstall() {
    my ( $self, $args ) = @_;

    return 1;
}

sub tool {
    my ( $self, $args ) = @_;
    my $cgi = $self->{'cgi'};
    my $template = $self->get_template({ file => 'tool.tt' });
    my $branchcode = C4::Context->userenv->{'branch'};
    my $json = {
        userlibrary => $branchcode
    };
    my $library;
    if ($branchcode) {
        $library = Koha::Libraries->find($branchcode);
        $json->{libraryemail} = $library->branchemail;
        $json->{libraryreplyto} = $library->branchreplyto;
        $json->{libraryreturnpath} = $library->branchreturnpath;
        $json->{libraryname} = $library->branchname;

    }
    
    $template->param(
        data => JSON::to_json($json)
    );
    print $cgi->header(-charset    => 'utf-8');
    print $template->output();
}

sub api_routes {
    my ( $self, $args ) = @_;

    my $spec_str = $self->mbf_read('openapi.json');
    my $spec     = decode_json($spec_str);

    return $spec;
}

sub api_namespace {
    my ( $self ) = @_;
    
    return 'kohasuomi';
}

1;

