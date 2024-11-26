package com.codingping.service;

import com.codingping.entity.Storage;
import com.codingping.repository.StorageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StorageService {

    private final StorageRepository storageRepository;

    public StorageService(StorageRepository storageRepository) {
        this.storageRepository = storageRepository;
    }

    public Storage saveStorage(Storage storage) {
        return storageRepository.save(storage);
    }

    public List<Storage> getStorageByUserId(Long userId) {
        return storageRepository.findByUserId(userId);
    }
}