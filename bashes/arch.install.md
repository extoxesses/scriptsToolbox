# Arch Linux installation guide

## Disk partitioning
Start disk partitioning using `fdisk` tool
```
fdisk /dev/sdX
```

### Only for UEFI system
```
Command (m for help): n
Partition number (1-128, default: 1):
First sector (X-Y, default X):
Last sector, +sectors or +suze{K,M,G,T,P} (X-Y, default Y): +512M

...
```

