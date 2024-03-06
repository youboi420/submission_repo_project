#include <pcap.h>
#include <stdlib.h>

typedef enum EXIT_CODES {
    FAILED = EXIT_FAILURE,
    VALID = 1001,
    INVALID = 1002,
} EXIT_CODES;

int main(int argc, char *argv[])
{
	char errbuf[PCAP_ERRBUF_SIZE], *pcap_file;
    pcap_t *handle;
    
    if (argc != 2)
    {
        printf("Usage: %s <pcap file> \n", argv[0]);
        return FAILED;
    }
    pcap_file = argv[1];
    handle = pcap_open_offline(pcap_file, errbuf);

    if (handle == NULL)
    {
        fprintf(stderr, "Error opening pcap file: %s\n", errbuf);
        return INVALID;
    }
    pcap_close(handle);
    return VALID;
}
